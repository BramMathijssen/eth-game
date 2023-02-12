import { React, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import EthersContext from "../context/ethers-context";
import UiContext from "../context/ui-context";

import styles from "./EnterGame.module.scss";

const EnterGame = () => {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const ethersCtx = useContext(EthersContext);
  const uiCtx = useContext(UiContext);

  const depositHandler = async (e) => {
    e.preventDefault();
    console.log(`amount deposited is ${depositAmount}`);

    setLoading(true);
    console.log(`----contract----`);
    console.log(ethersCtx.contract);
    e.preventDefault();

    const gasPrice = await ethersCtx.contract.estimateGas.deposit({
      value: ethers.utils.parseEther(depositAmount),
    });
    const tx = await ethersCtx.contract.deposit({
      value: ethers.utils.parseEther(depositAmount),
      gasLimit: gasPrice,
    });

    await tx.wait(1);
    setLoading(false);
    uiCtx.updateUi();
  };

  const handleDepositAmountChange = (e) => {
    setDepositAmount(e.target.value);
  };

  return (
    <div className={styles.enterGame}>
      {loading ? <p>Loading...</p> : null}
      <form onSubmit={depositHandler}>
        <label className={styles.label}>Enter Amount:</label>
        <input
          className={styles.input}
          type="text"
          placeholder="0"
          onChange={handleDepositAmountChange}
        ></input>
        {ethersCtx.contract && (
          <button className={`${styles.button} ${styles.deposit}`}>
            Deposit
          </button>
        )}
      </form>
    </div>
  );
};

export default EnterGame;
