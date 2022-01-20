import React from "react";
import App from "./App";
import { ContractContextProvider } from './contexts/contractContext';
import { PlayerContextProvider } from './contexts/playerContext';
import { ThemeContextProvider } from "./contexts/themeContext";
import { TransactionContextProvider } from './contexts/transactionContext';
import { Providers } from "./Providers";

export default () => (
  <ThemeContextProvider>
    <Providers>
      <ContractContextProvider>
        <TransactionContextProvider>
          <PlayerContextProvider>
            <App />
          </PlayerContextProvider>
        </TransactionContextProvider>
      </ContractContextProvider>
    </Providers>
  </ThemeContextProvider>
);
