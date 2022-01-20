import React, { useState } from "react";

export const ContractContext = React.createContext({
  allsong: null,
  loadSong: () => null,
});

export const ContractContextProvider = (props) => {
  const [allSong, setAllSong] = useState(null);

  const loadSong = async () => {};

  const value = {
    allsong: allSong,
    loadSong,
  };

  return (
    <ContractContext.Provider value={value}>
      {props.children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => React.useContext(ContractContext);
