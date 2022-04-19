require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const { assert, expect } = require('chai');
require('solidity-coverage')
require("./tasks")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});


// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      gasPrice: 20000000000,
      gas: 10000000,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURAKEY}`,
      //url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.RINKEBYKEY}`,
      accounts: [`${process.env.PK}`]
    },
    ropsten: {
      gasPrice: 50,
      gas: 100000,
      url: `https://ropsten.infura.io/v3/${process.env.INFURAKEY}`,
      //url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ROPSTENKEY}`,
      accounts: [`${process.env.PK}`]
    }
  },
  solidity: {
    version : "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 500000
  }
};
