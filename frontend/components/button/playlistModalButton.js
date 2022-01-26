import { Text } from "galio-framework";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function PlaylistModalButton(props) {
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();
  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={(e) => {
        playerContext.openPlaylistModal();
      }}
    >
      <View
        style={{
          height: 70,
          backgroundColor: theme.colors.card,
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 20,
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <Text p bold color={theme.colors.text}>
          Playlist
        </Text>
      </View>
    </TouchableOpacity>
  );
}
