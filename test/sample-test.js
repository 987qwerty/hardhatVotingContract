const { expect, assert } = require("chai")
const { ethers } = require("hardhat") 
const hre = require("hardhat")
const {BigNumber} = require("ethers");

describe("VotingContract", function () {
  let accounts
  let VotingContractFactory
  let votingContract
    before(async function (){
      accounts = await hre.ethers.getSigners()
      VotingContractFactory = await ethers.getContractFactory("VotingContract")
      votingContract = await VotingContractFactory.deploy()
      await votingContract.deployed()
    })
  it("Should deploy and successfully get owner", async function () {
    expect(await votingContract.owner()).to.equal(accounts[0].address) // acc 0 - owner. acc2 - winner
  })
  it("Should create voting", async function(){
    await votingContract.createVote([accounts[1].address, accounts[2].address, accounts[3].address])
    expect(await votingContract.getProposals(0)).deep.equal([accounts[1].address, accounts[2].address, accounts[3].address])
    expect((await votingContract.votings(0)).endAt.toNumber()).greaterThan((await hre.ethers.provider.getBlock()).timestamp)
  })

  it("Should vote", async function(){
    await votingContract.connect(await hre.ethers.getSigner(accounts[4].address)).vote(0, accounts[2].address, {value : ethers.utils.parseEther("0.01")})
    expect(await votingContract.getVoteCount(0, accounts[2].address)).deep.equal(1)
    expect(await votingContract.voteBalance(0)).deep.equal(ethers.utils.parseEther("0.01"))
    expect(await votingContract.isEnded(0)).deep.equal(false)

  })
  it("Shouldnt end", async function(){
    try {
      await votingContract.end(0)
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("not ended")
    }
  })
  it("Shouldnt withdrawal", async function(){
    try {
      await votingContract.withdrawal(0)
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("not ended")
    }
  })
  it("Shouldnt get winner", async function(){
    try {
      expect(await votingContract.getWinner(0))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("not ended")
    }
  })
  it("Shouldnt vote", async function(){
    try {
      ( await votingContract.connect(await hre.ethers.getSigner(accounts[4].address)).vote(0, accounts[2].address, {value : ethers.utils.parseEther("0.01")}))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("already voted")
    }

  })
  it("Shouldnt vote 2", async function(){
    try {
      ( await votingContract.connect(await hre.ethers.getSigner(accounts[5].address)).vote(0, accounts[6].address, {value : ethers.utils.parseEther("0.01")}))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("not proposal")
    }
  })
  it("Shouldnt vote 3", async function(){
    try {
      ( await votingContract.connect(await hre.ethers.getSigner(accounts[2].address)).vote(0, accounts[1].address, {value : ethers.utils.parseEther("0.01")}))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("Proposals cant vote")
    }
  })
  it("Shouldnt vote 4", async function(){
    try {
      ( await votingContract.connect(await hre.ethers.getSigner(accounts[5].address)).vote(0, accounts[2].address, {value : ethers.utils.parseEther("0.001")}))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("deposit != 0.01 eth")
    }
  })

  it("Should win", async function(){
    while (((await hre.ethers.provider.getBlock()).timestamp) < (await votingContract.votings(0)).endAt.toNumber()){
      await hre.ethers.provider.send("evm_increaseTime", [3600])
      await hre.ethers.provider.send("evm_mine")
    }

    _balance = await hre.ethers.provider.getBalance( accounts[2].address)
    await votingContract.end(0)


    expect((await votingContract.votings(0)).ended).deep.equal(true)
    expect(await votingContract.getWinner(0)).deep.equal(accounts[2].address)

    expect(await hre.ethers.provider.getBalance( accounts[2].address)).deep.equal(_balance.add( ethers.utils.parseEther("0.01") * 0.9))
    _balance = await hre.ethers.provider.getBalance( accounts[0].address)
    await votingContract.withdrawal(0)

    expect(await hre.ethers.provider.getBalance(accounts[0].address))
        .to.be.within((_balance.add( ethers.utils.parseEther("0.01") * 0.1 - ethers.utils.parseEther("0.0001"))),
        _balance.add( ethers.utils.parseEther("0.01") * 0.1)) //range because of gas spending
  })


  it("Shouldnt vote 5", async function(){
    try {
      ( await votingContract.connect(await hre.ethers.getSigner(accounts[5].address)).vote(0, accounts[2].address, {value : ethers.utils.parseEther("0.01")}))
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("ended")
    }
  })
  it("Shouldnt end 2", async function(){
    try {
      await votingContract.end(0)
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("already ended")
    }
  })
  it("Shouldnt create", async function(){
    try {
      await votingContract.connect(await hre.ethers.getSigner(accounts[4].address)).createVote([accounts[1].address, accounts[2].address, accounts[3].address])
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("only owner")
    }
  })
  it("Shouldnt withdrawal", async function(){
    try {
      await votingContract.connect(await hre.ethers.getSigner(accounts[4].address)).withdrawal(0)
      expect(true).deep.equal(false)
    } catch (error){
      expect(error.toString()).contain("only owner")
    }
  })

})
