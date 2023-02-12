import "../styles/globals.css";

import { React, useState, useEffect } from "react";
import { EthersContextProvider } from "../context/ethers-context";
import { UiContextProvider } from "../context/ui-context";

function MyApp({ Component, pageProps }) {
  return (
    <EthersContextProvider>
      <UiContextProvider>
        <Component {...pageProps} />
      </UiContextProvider>
    </EthersContextProvider>
  );
}

export default MyApp;
