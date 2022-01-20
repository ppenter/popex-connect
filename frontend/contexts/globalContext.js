import React from "react";

export const GlobalContext = React.createContext({});

export const GlobalContextProvider = (props) => {
  const value = {};

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
