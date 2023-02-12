import { React, useEffect, useContext } from "react";
import { ethers } from "ethers";
import EthersContext from "../context/ethers-context";
import UiContext from "../context/ui-context";

import styles from "./GameDetails.module.scss";

const GameDetails = () => {;
  const ethersCtx = useContext(EthersContext);
  const uiCtx = useContext(UiContext);

  useEffect(() => {
    uiCtx.updateUi();
  }, []);

  ethersCtx.contract
    ? ethersCtx.contract.on("GameWon", (winner, amountWon) => {
        const amountInEth = ethers.utils.formatEther(amountWon);
        uiCtx.setGameWon(
          `You Won the game! The winning address is: ${winner} , with and amountWon of ${amountInEth} ETH}`
        );
        console.log(`game has been Won!`);
      })
    : null;

  return (
    <div className={styles.gameDetails}>
      <div className="details">
        <p>Current Balance in Contract: {uiCtx.contractBalance} ETH</p>
        <p>Current Games Played: {uiCtx.playerCount}</p>
      </div>
      <div className="event">{uiCtx.gameWon && uiCtx.gameWon}</div>
    </div>
  );
};

export default GameDetails;
