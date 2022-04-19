require('dotenv').config();


const abi = ["function end(uint votingNumber)"]

task("end", "End vote")
        .addParam("num", "Number of voting") // example of input: [0xb6732A7F4183D7f951374a43C8319603889Be7ca,0x5a67391cd7B01cF59Af3f9A1FFb87832101190F2]
        .setAction(async (taskArgs, hre) => {
            VotingContractFactory = await ethers.getContractFactory("VotingContract")
            const contract = await new ethers.Contract(`${process.env.address}`, abi, (await hre.ethers.getSigners())[0]);
            tx = await contract.end(taskArgs.num);
            console.log("tx hash: ", tx.hash)
        });
