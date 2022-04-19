require('dotenv').config();


const abi = ["function vote(uint votingNumber, address proposal) payable"]

task("vote", "Vote for a proposal")
    .addParam("num", "Number of voting") // example of input: npx hardhat vote --num 0 --adr 0xb6732A7F4183D7f951374a43C8319603889Be7ca
    .addParam("adr", "Addresses of proposal to vote")
    .setAction(async (taskArgs, hre) => {
    VotingContractFactory = await ethers.getContractFactory("VotingContract")
    const contract = await new ethers.Contract(`${process.env.address}`, abi, (await hre.ethers.getSigners())[0]);
    tx = await contract.vote(taskArgs.num, taskArgs.adr, {value: 10000000000000000n});
    console.log("tx hash: ", tx.hash)
});
