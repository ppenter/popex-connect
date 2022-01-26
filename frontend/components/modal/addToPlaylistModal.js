import { Text } from "galio-framework";
import * as React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useGlobalContext } from "../../contexts/globalContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
import LongPlaylist from "../button/longPlaylist";
import SongCard from "../carousel/card";

export default function AddToPlaylistModal(props) {
  const playerContext = usePlayerContext();
  const theme = useThemeContext().theme;
  const global = useGlobalContext();
  const moralis = useMoralis();

  const { title = "Add to playlist" } = props;

  if (!moralis.user || playerContext.addToPlaylistSongId == "test") {
    return null;
  }

  const songInformation = useMoralisQuery(
    "popexUpload",
    (q) => q.equalTo("uid", playerContext.addToPlaylistSongId),
    [playerContext.addToPlaylistSongId]
  );

  const playlistList = useMoralisQuery(
    "Playlist",
    (q) =>
      q
        .equalTo("userCreatedAt", moralis.user.createdAt)
        .equalTo("creatorId", moralis.user.id),
    [global.trigger]
  );

  const songList = playlistList.data;
  return (
    <Modal
      animationIn="slideInUp"
      propagateSwipe={true}
      onSwipeComplete={(e) => {
        playerContext.closeAddToPlaylistModal();
      }}
      swipeDirection="down"
      transparent={true}
      swipeThreshold={100}
      isVisible={playerContext.isAddToPlaylistModal}
      style={{ justifyContent: "flex-end", margin: 0, paddingTop: "30%" }}
    >
      <View
        style={{
          backgroundColor: theme.colors.card,
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: 20,
        }}
      >
        <View id="header" style={{ alignItems: "center", marginTop: 20 }}>
          <View
            style={{
              width: 70,
              height: 3,
              borderRadius: 10,
              backgroundColor: theme.colors.text,
              marginBottom: 10,
            }}
          />
          <Text p bold color={theme.colors.text} style={{ marginBottom: 10 }}>
            {title}
          </Text>
          <SongCard item={songInformation.data[0]} />
        </View>

        <ScrollView style={{ height: "70%", paddingHorizontal: 20 }}>
          {playlistList.data.length > 0
            ? playlistList.data.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <LongPlaylist
                      name={item.attributes.name}
                      playlistId={item.id}
                    />
                  </TouchableOpacity>
                );
              })
            : null}
          <View style={{ height: 50 }}></View>
        </ScrollView>
      </View>
    </Modal>
  );
}
