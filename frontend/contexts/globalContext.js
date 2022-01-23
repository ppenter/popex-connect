import React, { useState } from "react";

export const GlobalContext = React.createContext({
  trigger: false,
  toggleTrigger: () => null,
});

export const GlobalContextProvider = (props) => {
  const [trigger, setTrigger] = useState(false);

  const toggleTrigger = () => {
    trigger ? setTrigger(false) : setTrigger(true);
    console.log(trigger);
  };
  const value = {
    trigger: trigger,
    toggleTrigger,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
