import { Text } from "galio-framework";
import React from "react";
import { Image, View } from "react-native";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
import AddToPlaylistModalButton from "./addToPlaylistModalButton";
export default function LongSong(props) {
  const theme = useThemeContext().theme;

  const playerContext = usePlayerContext();

  const allName = useMoralisContext().allName;

  const { songName, artistAddress, songId, songImage } = props;
  return (
    <View
      style={{
        width: "100%",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 5,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{
            url: songImage,
          }}
          style={{
            width: 50,
            height: 50,
            backgroundColor: theme.colors.secondary,
            borderRadius: 5,
          }}
        ></Image>
        <View
          style={{ justifyContent: "center", paddingLeft: 15, maxWidth: "70%" }}
        >
          <Text
            numberOfLines={1}
            bold
            size={16}
            color={
              playerContext.playlist
                ? playerContext.playlist[playerContext.currentIndex].attributes
                    .uid == songId
                  ? theme.colors.primary
                  : theme.colors.text
                : theme.colors.text
            }
          >
            {songName}
          </Text>
          <Text numberOfLines={1} color={theme.colors.disable}>
            {allName[artistAddress]
              ? allName[artistAddress].username
              : artistAddress}
          </Text>
        </View>
      </View>
      <View
        style={{ height: 60, alignItems: "center", justifyContent: "center" }}
      >
        <AddToPlaylistModalButton songId={songId} />
      </View>
    </View>
  );
}
