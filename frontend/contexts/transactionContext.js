import React from 'react';

const API_URL = 'http://192.168.1.52:9000';

export const TransactionContext = React.createContext({
  loginToDatabase: () => null,
});

export const TransactionContextProvider = props => {
  const loginToDatabase = async connector => {
    try {
      let result = await fetch(API_URL + '/user/getNonce', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: '0xd78958ef33F82Cfad358F2A855a06C059542598F',
        }),
      });
      console.log('start fetch');
      let json = await result.json();
      console.log(json.nonce);
    } catch {
      e => {
        console.log(e);
      };
    }
  };

  const value = {
    loginToDatabase,
  };

  return (
    <TransactionContext.Provider value={value}>
      {props.children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => React.useContext(TransactionContext);
