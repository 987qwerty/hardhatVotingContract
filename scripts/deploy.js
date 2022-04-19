const hre = require("hardhat");
const {ethers} = require("hardhat");
require('dotenv').config();

async function main() {
  VotingContractFactory = await ethers.getContractFactory("VotingContract")
  votingContract = await VotingContractFactory.deploy()
  await votingContract.deployed()

  console.log("Voting contract deployed to:", votingContract.address);
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

