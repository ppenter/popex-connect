import { Text } from "galio-framework";
import * as React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import LongSong from "../components/button/longSong";
import AddToPlaylistModal from "../components/modal/addToPlaylistModal";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function PlaylistModal(props) {
  const playerContext = usePlayerContext();
  const theme = useThemeContext().theme;
  return (
    <Modal
      animationIn="slideInUp"
      onDismiss={(e) => {
        playerContext.closePlaylistModal();
      }}
      propagateSwipe={true}
      onSwipeComplete={(e) => {
        playerContext.closePlaylistModal();
      }}
      swipeDirection="down"
      transparent={true}
      swipeThreshold={150}
      isVisible={playerContext.isPlaylistModal}
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
        <View
          id="header"
          style={{ alignItems: "center", marginTop: 20, paddingBottom: 10 }}
        >
          <View
            style={{
              width: 70,
              height: 3,
              borderRadius: 10,
              backgroundColor: theme.colors.text,
              marginBottom: 10,
            }}
          />
          <Text p bold color={theme.colors.text}>
            Playlist
          </Text>
        </View>
        <ScrollView style={{ height: "70%", paddingHorizontal: 20 }}>
          {playerContext.playlist
            ? playerContext.playlist.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item.attributes.uid}
                    onPress={(e) => {
                      e.stopPropagation();
                      playerContext.playPlaylist(playerContext.playlist, index);
                    }}
                  >
                    <LongSong
                      songId={item.attributes.uid}
                      songName={item.attributes.title}
                      artistAddress={item.attributes.creator}
                      songImage={item.attributes.coverURI}
                    />
                  </TouchableOpacity>
                );
              })
            : null}
          <View style={{ height: 50 }}></View>
        </ScrollView>
        <AddToPlaylistModal />
      </View>
    </Modal>
  );
}
