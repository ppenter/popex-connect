import React from "react";
import App from "./App";
import { ContractContextProvider } from './contexts/contractContext';
import { GlobalContextProvider } from "./contexts/globalContext";
import { MoralisContextProvider } from './contexts/moralisContext';
import { PlayerContextProvider } from './contexts/playerContext';
import { ThemeContextProvider } from "./contexts/themeContext";
import { TransactionContextProvider } from './contexts/transactionContext';
import { Providers } from "./Providers";

export default () => (
  <ThemeContextProvider>
    <GlobalContextProvider>
      <Providers>
        <MoralisContextProvider>
          <ContractContextProvider>
            <TransactionContextProvider>
              <PlayerContextProvider>
                <App />
              </PlayerContextProvider>
            </TransactionContextProvider>
          </ContractContextProvider>
        </MoralisContextProvider>
      </Providers>
    </GlobalContextProvider>
  </ThemeContextProvider>
);
