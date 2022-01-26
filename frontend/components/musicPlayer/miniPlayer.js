import { Text } from "galio-framework";
import React from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";

export default function MiniPlayer(props) {
  Icon.loadFont();
  const playerContext = usePlayerContext();
  const theme = useThemeContext().theme;
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");

  if (playerContext.playlist || playerContext.isMiniModal) {
  } else {
    return null;
  }

  // if (
  //   !playerContext.playlist ||
  //   playerContext.isModal ||
  //   !playerContext.playbackInstance ||
  //   !playerContext.playbackInstance._loaded ||
  //   !allName.data
  // ) {
  //   if (PlayerContext.playlist) {
  //     return <View style={{ ...containerStyle }}></View>;
  //   } else {
  //     return null;
  //   }
  // }

  const currentSong =
    playerContext.playlist && playerContext.playbackInstance._loaded
      ? playerContext.playlist[playerContext.currentIndex]
      : null;

  const {
    icon = "home",
    size = 20,
    color = theme.colors.text,
    TrackPlayer,
  } = props;

  const containerStyle = {
    display: "flex",
    left: 20,
    right: 20,
    maxWidth: 1000,
    height: 70,
    bottom: 75,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };
  const innerContainerStyle = {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
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
          <View style={{ width: 50, height: 50 }}>
            <Image
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              source={{
                url: currentSong ? currentSong.attributes.coverURI : "",
              }}
            />
          </View>
          <View style={{ marginLeft: 20, width: "50%" }}>
            <Text bold size={16} numberOfLines={1} color={theme.colors.text}>
              {currentSong ? currentSong.attributes.title : "Loading..."}
            </Text>
            <Text mute numberOfLines={1} color={theme.colors.disable}>
              {currentSong
                ? allName.data[currentSong.attributes.creator]
                  ? allName.data[currentSong.attributes.creator].username
                  : currentSong.attributes.creator
                : ""}
            </Text>
          </View>
        </View>

        <View
          style={{
            ...buttonContainer,
            position: "absolute",
            right: 0,
            height: "100%",
          }}
        >
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {playerContext.isPlaying ? (
              <TouchableOpacity
                style={{ justifyContent: "center", width: 50, height: 50 }}
                onPress={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
                  e.stopPropagation();
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
