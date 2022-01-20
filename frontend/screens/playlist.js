import { Text } from "galio-framework";
import * as React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "../contexts/themeContext";

export default function PlaylistScreen(props) {
  const theme = useThemeContext().theme;
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row" }}>
        <Icon name="musical-notes" color="red" size={40}></Icon>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          Playlist
        </Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Text h3 color={theme.colors.text} style={{ marginLeft: 10 }}>
          Coming soon
        </Text>
      </View>
    </View>
  );
}
