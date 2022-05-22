require('dotenv').config();


const abi = ["function vote(uint votingNumber, uint proposalId) payable"]

task("vote", "Vote for a proposal")
    .addParam("num", "Number of voting") // example of input: npx hardhat vote --num 0 --adrId 0
    .addParam("adr", "Addresses of proposal to vote")
    .setAction(async (taskArgs, hre) => {
    const contract = await new ethers.Contract(`${process.env.address}`, abi, (await hre.ethers.getSigners())[0]);
    tx = await contract.vote(taskArgs.num, taskArgs.adrId, {value: 10000000000000000n});
    console.log("tx hash: ", tx.hash)
});
