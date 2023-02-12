const { ethers } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE = "../ethgame-frontend/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../ethgame-frontend/constants/abi.json";

module.exports = async function() {
  if (process.env.UPDATE_FRONT_END) {
    console.log(`updating front end...`);
    updateContractAddresses();
    updateAbi();
  }
};

async function updateAbi() {
  console.log(`updating`);
  const ethGame = await ethers.getContract("EthGame");
  console.log(`writing abi`);
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    ethGame.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract("EthGame");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );

  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(raffle.address)) {
      currentAddresses[chainId].push(raffle.address);
    }
  }
  {
    currentAddresses[chainId] = [raffle.address];
  }
  console.log("writing contract address");
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
