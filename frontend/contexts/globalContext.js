import React, {useState} from 'react';
import Web3 from 'web3';

export const GlobalContext = React.createContext({
  chainId: 3,
  rpc: new Web3(
    new Web3.providers.HttpProvider(
      `https://ropsten.infura.io/v3/fc1094913ebd41a3853b32571ebe6bbb`,
    ),
  ),
});

export const GlobalContextProvider = props => {
  const [chainId, setChainId] = useState(3);

  const supportChainIds = {
    1: {
      id: '1',
      name: 'mainnet',
      rpc: 'https://mainnet.infura.io/API_KEY',
      explorer: 'https://etherscan.io',
      icon: require('../../assets/images/chainIcon/eth.png'),
    },
    56: {
      id: '56',
      name: '',
      rpc: '',
      explorer: '',
      icon: require('../../assets/images/chainIcon/bsc.png'),
    },
    1337: {
      id: '1337',
      name: 'localhost',
      rpc: 'http://localhost:8545',
      explorer: '',
      icon: require('../../assets/images/chainIcon/matic.png'),
    },
    3: {
      id: '3',
      name: 'ropsten',
      rpc: 'wss://mainnet.infura.io/ws/v3/fc1094913ebd41a3853b32571ebe6bbb',
      icon: require('../../assets/images/chainIcon/eth.png'),
    },
  };

  console.log(supportChainIds[chainId].rpc);

  const value = {
    chainId: chainId,
    rpc: supportChainIds[chainId].rpc,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
