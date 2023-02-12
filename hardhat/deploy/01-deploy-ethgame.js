const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  arguments = [];
  await deploy("EthGame", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["all", "ethgame", "main"];
