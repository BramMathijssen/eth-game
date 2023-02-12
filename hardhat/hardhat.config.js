require("ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("dotenv").config();

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url:
          "https://eth-mainnet.g.alchemy.com/v2/HrINZAHYw97HLwgFGjfRDmNl9JHXVA8T",
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
