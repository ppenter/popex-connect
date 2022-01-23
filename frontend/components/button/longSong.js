import { Text } from "galio-framework";
import React from "react";
import { Image, View } from "react-native";
import { useMoralisContext } from "../../contexts/moralisContext";
import { useThemeContext } from "../../contexts/themeContext";
import LikeButton from "./likeButton";
export default function LongSong(props) {
  const theme = useThemeContext().theme;

  const allName = useMoralisContext().allName;

  const { songName, artistAddress, songId, songImage } = props;

  return (
    <View
      style={{
        width: "100%",
        height: 60,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 5,
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
        <View style={{ justifyContent: "center", paddingLeft: 15 }}>
          <Text bold size={16} color={theme.colors.text}>
            {songName}
          </Text>
          <Text color={theme.colors.disable}>
            {allName[artistAddress]
              ? allName[artistAddress].username
              : artistAddress}
          </Text>
        </View>
      </View>
      <LikeButton songId={songId} />
    </View>
  );
}
