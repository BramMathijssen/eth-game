const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");

describe("EthGame Unit Tests", function() {
  let ethGame, deployer, accounts;
  const sendValue = ethers.utils.parseEther("0.1");
  beforeEach(async () => {
    accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    deployer = accounts[0];
    await deployments.fixture("ethgame"); // Deploys modules with the tags “ethgame”
    ethGame = await ethers.getContract("EthGame"); // Returns a new connection to the EthGame Contract
  });
  describe("Contract initialisation", () => {
    it("Initialised the contract with an playercount of 0", async () => {
      const playerCount = await ethGame.s_playerCounter();

      assert.equal(playerCount, "0");
    });
  });
  describe("deposit function", () => {
    it("Transaction reverts if not enough ETH is sent with transaction", async () => {
      await expect(ethGame.deposit()).to.be.reverted;
    });
    it("Increases playerCounter by one after sending 0.1ETH to the deposit function", async () => {
      await ethGame.deposit({ value: sendValue });

      const playerCountAfter = await ethGame.s_playerCounter();
      assert.equal(playerCountAfter, "1");
    });
    it("Increases playerCounter to 10 after doing 10 deposit calls", async () => {
      const playerCountStart = await ethGame.s_playerCounter();
      console.log(`player counter at start is ${playerCountStart}`);
      for (let i = 0; i < 10; i++) {
        await ethGame.deposit({ value: sendValue });
      }

      const playerCountAfter = await ethGame.s_playerCounter();
      console.log(`player counter at end is ${playerCountAfter}`);
      assert.equal(playerCountAfter, "10");
    });
    it("Resets the playerCount to 0 after the playercount reached 14", async () => {
      const playerCountStart = await ethGame.s_playerCounter();
      for (let i = 0; i < 14; i++) {
        await ethGame.deposit({ value: sendValue });
      }

      const playerCountAfter = await ethGame.s_playerCounter();
      console.log(`player counter at end is ${playerCountAfter}`);
      assert.equal(playerCountAfter, "0");
    });
  });
  describe("(Redundant Test) Testing Transfering Funds Between Accounts", () => {
    beforeEach(async () => {
      accounts = await ethers.getSigners(); // could also do with getNamedAccounts
      userConnectedContract = await ethGame.connect(accounts[1]);
      userAccount = accounts[1];
    });
    it("Testing of sending 0.1 ETH from account1 to account 2", async () => {
      console.log(`Checking Balance of address: ${userAccount.address}`);
      const balanceBefore = (
        await ethGame.provider.getBalance(userAccount.address)
      ).toString();
      console.log(
        "Balance before sending tx: ",
        ethers.utils.formatEther(balanceBefore),
        "ETH"
      );

      let tx = {
        to: accounts[2].address,
        value: ethers.utils.parseEther("0.1"),
      };

      // getting the gas cost for the transaction
      const txResponse = await accounts[1].sendTransaction(tx);
      const txReceipt = await txResponse.wait();
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const balanceAfter = (
        await ethGame.provider.getBalance(userAccount.address)
      ).toString();
      console.log(
        "Balance after sending tx: ",
        ethers.utils.formatEther(balanceAfter),
        "ETH"
      );
    });
  });
  describe("Winning Functions", () => {
    let userConnectedContract, userAccount;
    beforeEach(async () => {
      accounts = await ethers.getSigners(); // could also do with getNamedAccounts
      userConnectedContract = await ethGame.connect(accounts[1]);
      userAccount = accounts[1];
      for (let i = 0; i < 14; i++) {
        await userConnectedContract.deposit({ value: sendValue });
      }
    });
    it("Testing the winning function", async () => {
      const balanceBeforeWinning = (
        await userConnectedContract.provider.getBalance(userAccount.address)
      ).toString();
      console.log(ethers.utils.formatEther(balanceBeforeWinning), "ETH");

      const contractBalance = (await ethGame.provider.getBalance(ethGame.address)).toString();
      console.log(ethers.utils.formatEther(contractBalance), "ETH Contract balance")

      await userConnectedContract.deposit({ value: sendValue });

      const balanceAfterWinning = (
        await userConnectedContract.provider.getBalance(userAccount.address)
      ).toString();
      console.log(ethers.utils.formatEther(balanceAfterWinning), "ETH");

      assert.equal(balanceBeforeWinning.add, "0");
    });
  });
  describe("Testing the emit of event after winning ", () => {
    it.only("Testing if the GameWon event will be emitted after the game has been won", async () => {
      for (let i = 0; i < 14; i++) {
        await ethGame.deposit({ value: sendValue });
      }
      await expect(ethGame.deposit({ value: sendValue })).to.emit(
        ethGame,
        "GameWon"
      );
    });
    // check this
    it("Testing if the the right arguments will be emitted on the game won event", async () => {
      for (let i = 0; i < 14; i++) {
        await ethGame.deposit({ value: sendValue });
      }

      const bal = await ethGame.provider.getBalance(ethGame.address);
      console.log(`balance is ${bal}`);

      await expect(ethGame.deposit({ value: sendValue }))
        .to.emit(ethGame, "GameWon")
        .withArgs(
          deployer.address,
          (await ethGame.provider.getBalance(ethGame.address)).add(
            ethers.utils.parseEther("0.1")
          )
        );
    });
  });
});
