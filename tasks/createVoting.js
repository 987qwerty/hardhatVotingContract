

const abi = ["function createVote(address[] memory proposalNames)"]

task("cv", "Create a vote")
    .addParam("addresses", "Addresses of proposals") // example of input: npx hardhat cv --addresses [0xb6732A7F4183D7f951374a43C8319603889Be7ca,0x5a67391cd7B01cF59Af3f9A1FFb87832101190F2]
    .setAction(async (taskArgs, hre) => {
    const contract = await new ethers.Contract(`${process.env.address}`, abi, (await hre.ethers.getSigners())[0])
    tx = await contract.createVote(taskArgs.addresses.slice(1, -1).split(","))
    console.log("tx hash: ", tx.hash)
})