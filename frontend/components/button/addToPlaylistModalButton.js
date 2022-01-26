import React from "react";
import { useMoralis } from "react-moralis";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../contexts/globalContext";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function AddToPlaylistModalButton(props) {
  const { size = 25 } = props;
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();
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
        <Icon color={theme.colors.disable} size={size} name={"add"} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={async (e) => {
        e.preventDefault();
        playerContext.openAddToPlaylistModal(songId);
      }}
    >
      <Icon color={theme.colors.text} size={size} name={"add"} />
    </TouchableOpacity>
  );
}
