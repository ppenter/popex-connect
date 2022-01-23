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
  if (
    !playerContext.playlist ||
    playerContext.isModal ||
    !playerContext.playbackInstance ||
    !playerContext.playbackInstance._loaded ||
    !allName.data
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
    height: 60,
    bottom: 80,
    position: "absolute",
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
    shadowOffset: { width: 0, height: -5 },
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
          <View style={{ width: 40, height: 40 }}>
            <Image
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              source={{
                url: playerContext.playbackInstance._loaded
                  ? currentSong.attributes.coverURI
                  : "",
              }}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text bold size={16} numberOfLines={1} color={theme.colors.text}>
              {playerContext.playbackInstance._loaded
                ? currentSong.attributes.title
                : ""}
            </Text>
            <Text
              mute
              numberOfLines={1}
              color={theme.colors.disable}
              style={{ maxWidth: "70%" }}
            >
              {allName.data[currentSong.attributes.creator]
                ? allName.data[currentSong.attributes.creator].username
                : currentSong.attributes.creator}
            </Text>
          </View>
        </View>

        <View
          style={{
            ...buttonContainer,
            position: "absolute",
            right: 0,
            top: 5,
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
