require('dotenv').config();


const abi = ["function end(uint votingNumber)"]

task("end", "End vote")
        .addParam("num", "Number of voting") // example of input: npx hardhat vote --num 0
        .setAction(async (taskArgs, hre) => {
            VotingContractFactory = await ethers.getContractFactory("VotingContract")
            const contract = await new ethers.Contract(`${process.env.address}`, abi, (await hre.ethers.getSigners())[0]);
            tx = await contract.end(taskArgs.num);
            console.log("tx hash: ", tx.hash)
        });
