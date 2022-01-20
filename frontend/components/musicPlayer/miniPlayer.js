import { Text } from "galio-framework";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";

export default function MiniPlayer(props) {
  Icon.loadFont();
  const playerContext = usePlayerContext();
  const theme = useThemeContext().theme;

  if (
    !playerContext.playlist ||
    playerContext.isModal ||
    !playerContext.playbackInstance ||
    !playerContext.playbackInstance._loaded
  ) {
    return null;
  }
  // if (!playerContext.playbackInstance) {
  //   return null;
  // } else {
  //   if (!playerContext.playbackInstance._loaded || !playerContext.playlist) {
  //     return null;
  //   }
  // }

  const currentSong = playerContext.playlist[playerContext.currentIndex];

  const {
    icon = "home",
    size = 20,
    color = theme.colors.text,
    TrackPlayer,
  } = props;

  const containerStyle = {
    display: "flex",
    width: "100%",
    maxWidth: 1000,
    height: 90,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.background,
  };
  const innerContainerStyle = {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.background,
    paddingTop: 10,
    borderRadius: 20,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  };
  const iconStyle = {
    paddingHorizontal: 20,
  };

  const trackContainer = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 10,
  };

  const buttonContainer = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
  };

  return (
    <View style={{ ...containerStyle }}>
      <TouchableOpacity
        onPress={() => playerContext.openModal()}
        style={{ ...innerContainerStyle }}
      >
        <View style={{ ...trackContainer }}>
          <View style={{ width: 60, height: 60 }}>
            {/* {console.log(currentSong.artwork)} */}
            <Image
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              source={{
                url: playerContext.playbackInstance._loaded
                  ? currentSong.artwork
                  : "",
              }}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text p color={theme.colors.text}>
              {playerContext.playbackInstance._loaded ? currentSong.title : ""}
            </Text>
            <Text muted numberOfLines={1} style={{ maxWidth: 100 }}>
              {playerContext.playbackInstance._loaded ? currentSong.artist : ""}
            </Text>
          </View>
        </View>

        <View style={{ ...buttonContainer }}>
          <View style={{ height: "100%", justifyContent: "center" }}>
            {playerContext.isPlaying ? (
              <TouchableOpacity
                style={{ justifyContent: "center", width: 50, height: 50 }}
                onPress={(e) => {
                  e.preventDefault();
                  playerContext.togglePlay();
                }}
              >
                <Icon
                  style={{ ...iconStyle }}
                  name="pause"
                  size={size}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ justifyContent: "center", width: 50, height: 50 }}
                onPress={(e) => {
                  e.preventDefault();
                  playerContext.togglePlay();
                }}
              >
                <Icon
                  style={{ ...iconStyle }}
                  name="play"
                  size={size}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              width: 50,
              height: 50,
              marginRight: 20,
            }}
            onPress={(e) => {
              e.preventDefault();
              playerContext.reset();
            }}
          >
            <Icon
              style={{ ...iconStyle }}
              name="times"
              size={size + 7}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}
