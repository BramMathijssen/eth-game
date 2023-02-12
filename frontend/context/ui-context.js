import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import EthersContext from "../context/ethers-context";

const UiContext = React.createContext({
  setGameWon: null,
  gameWon: null,
  playerCount: null,
  contractBalance: null,
  updateUi: () => {},
});

export const UiContextProvider = (props) => {
  const [playerCount, setPlayerCount] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [gameWon, setGameWon] = useState("");

  const ethersCtx = useContext(EthersContext);

  const updateUi = async () => {
    const playerCount = (await ethersCtx.contract.s_playerCounter()).toString();
    const contractBalance = (
      await ethersCtx.provider.getBalance(ethersCtx.contract.address)
    ).toString();
    const contractBalanceInEth = ethers.utils.formatEther(contractBalance);

    setPlayerCount(playerCount);
    setContractBalance(contractBalanceInEth);
    setGameWon("");
  };

  return (
    <UiContext.Provider
      value={{
        setGameWon: setGameWon,
        gameWon: gameWon,
        playerCount: playerCount,
        contractBalance: contractBalance,
        updateUi: updateUi,
      }}
    >
      {props.children}
    </UiContext.Provider>
  );
};

export default UiContext;
