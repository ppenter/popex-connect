import React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../contexts/globalContext";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function AddToPlaylistButton(props) {
  const { size = 25 } = props;
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();
  const likes = useMoralisContext().likes;
  const moralis = useMoralis();
  const global = useGlobalContext();
  const { songId, playlistId } = props;
  const moralisFunction = useMoralisContext();
  const songInPlaylist = useMoralisQuery(
    "SongInPlaylist",
    (q) => q.equalTo("playlistId", playlistId).equalTo("songId", songId),
    [global.trigger]
  );
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
      onPress={(e) => {
        e.preventDefault();
        moralisFunction.handleAddToPlaylist(songId, playlistId);
      }}
    >
      {songInPlaylist.data.length <= 0 ? (
        <Icon color={theme.colors.text} size={size} name={"add"} />
      ) : (
        <Icon color={theme.colors.text} size={size} name={"remove"} />
      )}
    </TouchableOpacity>
  );
}
