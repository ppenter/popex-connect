import React, { useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";

export const MoralisContext = React.createContext({
  moralis: null,
});

export const MoralisContextProvider = (props) => {
  const moralis = useMoralis();
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");

  const [likesSongData, setLikesSongData] = useState([]);

  const value = {
    moralis: moralis,
    likes: moralis.user ? moralis.user.attributes.like : [],
    allName: allName.data ? allName.data : [],
  };

  return (
    <MoralisContext.Provider value={value}>
      {props.children}
    </MoralisContext.Provider>
  );
};

export const useMoralisContext = () => React.useContext(MoralisContext);
