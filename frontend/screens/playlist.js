import { Text } from "galio-framework";
import * as React from "react";
import { ScrollView, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AddPlaylistButton from "../components/button/addPlaylistButton";
import Footer from "../components/navigation/footer";
import { useThemeContext } from "../contexts/themeContext";
import PlaylistScreenObject from "../screenObject/playlistObject";

export default function PlaylistScreen({ navigation, route }) {
  const theme = useThemeContext().theme;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 20, marginBottom: 150, paddingTop: 60 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          name="musical-notes"
          color={theme.colors.primary}
          size={40}
        ></Icon>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          Playlist
        </Text>
        <View style={{ position: "absolute", right: 0 }}>
          <AddPlaylistButton />
        </View>
      </View>
      <PlaylistScreenObject
        navigation={navigation}
        route={route}
      ></PlaylistScreenObject>
      <Footer />
    </ScrollView>
  );
}
