import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisCloudFunction,
  useMoralisQuery,
} from "react-moralis";
import { utils } from "../utils";
import { useGlobalContext } from "./globalContext";

export const MoralisContext = React.createContext({
  moralis: null,
  likes: [],
  allName: {},
  handleLike: () => null,
});

export const MoralisContextProvider = (props) => {
  const moralis = useMoralis();
  const global = useGlobalContext();
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");
  const allSong = useMoralisQuery("");

  const [likeOfUser, setLikeOfUser] = useState([]);

  useEffect(() => {
    getUserLike();
  }, [global.trigger, moralis.user]);

  const getUserLike = async () => {
    if (moralis.user) {
      try {
        const Like = moralis.Moralis.Object.extend("Like");
        const query = new moralis.Moralis.Query(Like);
        query.equalTo("userId", moralis.user.id);
        query.equalTo("userCreatedAt", moralis.user.createdAt);
        const results = await query.find();
        let likes = [];
        for (let i = 0; i < results.length; i++) {
          const like = results[i];
          if (!likes.includes(like.get("songId"))) {
            likes[i] = like.get("songId");
          }
        }
        setLikeOfUser(likes);
      } catch {}
    }
  };

  const handleLike = async (_songId) => {
    const Like = moralis.Moralis.Object.extend("Like");
    const query = new moralis.Moralis.Query(Like);
    query.equalTo("userId", moralis.user.id);
    query.equalTo("songId", _songId);
    const object = await query.find();
    if (object.length <= 0) {
      const Like = moralis.Moralis.Object.extend("Like");
      const newLike = new Like();
      newLike.set("userId", moralis.user.id);
      newLike.set("userCreatedAt", moralis.Moralis.User.current().createdAt);
      newLike.set("songId", _songId);
      newLike.set("timestamp", new Date(Date.now()));
      const ACL = new moralis.Moralis.ACL();
      ACL.setPublicReadAccess(true);
      ACL.setWriteAccess(moralis.Moralis.User.current(), true);
      newLike.setACL(ACL);
      newLike.save();
    } else {
      for (var i = 0; i < object.length; i++) {
        object[i].destroy();
      }
    }
    await utils.timeout(100);
    global.toggleTrigger();
  };

  const [likesSongData, setLikesSongData] = useState([]);

  const value = {
    moralis: moralis,
    likes: likeOfUser,
    allName: allName.data ? allName.data : [],
    handleLike,
  };

  return (
    <MoralisContext.Provider value={value}>
      {props.children}
    </MoralisContext.Provider>
  );
};

export const useMoralisContext = () => React.useContext(MoralisContext);
