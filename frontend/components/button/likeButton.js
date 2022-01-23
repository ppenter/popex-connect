import React from "react";
import { useMoralis } from "react-moralis";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../contexts/globalContext";
import { useMoralisContext } from "../../contexts/moralisContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function LikeButton(props) {
  const theme = useThemeContext().theme;
  const likes = useMoralisContext().likes;
  const moralis = useMoralis();
  const global = useGlobalContext();
  const { songId } = props;
  const moralisFunction = useMoralisContext();
  if (!moralis.user) {
    return (
      <TouchableOpacity
        onPress={(e) => {
          alert("Please login");
        }}
      >
        <Icon color={theme.colors.disable} size={40} name={"heart-outline"} />
      </TouchableOpacity>
    );
  }

  const Like = () => {
    const Like = moralis.Moralis.Object.extend("Like");
    const newLike = new Like();
    newLike.set("userId", moralis.user.id);
    newLike.set("userCreatedAt", moralis.Moralis.User.current().createdAt);
    newLike.set("songId", songId);
    newLike.set("timestamp", new Date(Date.now()));
    const ACL = new moralis.Moralis.ACL();
    ACL.setPublicReadAccess(true);
    ACL.setWriteAccess(moralis.Moralis.User.current(), true);
    newLike.setACL(ACL);
    newLike.save();
    global.toggleTrigger();
  };

  const likeToggle = () => {
    if (likes.includes(songId)) {
      moralis.user.fetch();
      let templike = [];
      for (var i in likes) {
        if (likes[i] !== songId) {
          templike.push(likes[i]);
        }
      }
      moralis.setUserData({ like: templike }).then(async () => {
        try {
          await timeout(100);
          moralis.user.fetch();
        } catch {}
      });
    } else {
      moralis.user.fetch();
      let templike = [];
      for (var i in likes) {
        templike[i] = likes[i];
      }
      templike[likes.length] = songId;
      moralis.setUserData({ like: templike }).then(async () => {
        try {
          await timeout(100);
          moralis.user.fetch();
        } catch {}
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={(e) => {
        e.preventDefault();
        moralisFunction.handleLike(songId);
      }}
    >
      {likes.includes(songId) ? (
        <Icon color={theme.colors.primary} size={40} name={"heart"} />
      ) : (
        <Icon color={theme.colors.text} size={40} name={"heart-outline"} />
      )}
    </TouchableOpacity>
  );
}
