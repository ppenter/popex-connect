import { MORALIS_APP_ID, MORALIS_SERVER_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moralis from "moralis/react-native.js";
import React from "react";
import { MoralisProvider } from "react-moralis";
import { Platform } from "react-native";
import { expo } from "../app.json";
import { enableViaWalletConnect } from "./Moralis/enableViaWalletConnect";
import WalletConnectProvider, { WalletConnectProviderProps } from "./WalletConnect";

interface ProvidersProps {
  readonly children: JSX.Element;
}

const { scheme } = expo;

/**
 * Initialization of Moralis
 */
const appId = MORALIS_APP_ID; // Application id from moralis.io
const serverUrl = MORALIS_SERVER_URL; //Server url from moralis.io
const environment = "native";
const getMoralis = () => Moralis;
// Initialize Moralis with AsyncStorage to support react-native storage
Moralis.setAsyncStorage(AsyncStorage);
// Replace the enable function to use the react-native WalletConnect
// @ts-ignore
Moralis.setEnableWeb3(enableViaWalletConnect);

const walletConnectOptions: WalletConnectProviderProps = {
  redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
  storageOptions: {
    // @ts-ignore
    asyncStorage: AsyncStorage,
  },
  qrcodeModalOptions: {
    mobileLinks: ["rainbow", "metamask", "argent", "trust", "imtoken", "pillar"],
  },
  // Uncomment to show a QR-code to connect a wallet
  // renderQrcodeModal: Qrcode,
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <WalletConnectProvider {...walletConnectOptions}>
      <MoralisProvider appId={appId} serverUrl={serverUrl} environment={environment} getMoralis={getMoralis}>
        {children}
      </MoralisProvider>
    </WalletConnectProvider>
  );
};
