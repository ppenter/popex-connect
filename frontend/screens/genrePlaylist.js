import { Card, Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { ScrollView, TouchableOpacity, View } from "react-native";
import LongSong from "../components/button/longSong";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function GenrePlaylist({ navigation, route }) {
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();
  const songByGenre = useMoralisQuery("popexUpload", (query) =>
    query.equalTo("genre", route.params.name)
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 20, marginTop: 20 }}
    >
      <View style={{ alignItems: "center" }}>
        <Card
          borderless
          style={{
            width: 150,
            height: 150,
            aspectRatio: 1,
            backgroundColor: theme.colors.secondary,
            marginBottom: 10,
          }}
          imageStyle={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
          }}
        ></Card>
        <Text h5 color={theme.colors.text}>
          {route.params.name}
        </Text>
      </View>
      {songByGenre.data
        ? songByGenre.data.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  playerContext.playPlaylist(songByGenre.data, index);
                }}
              >
                <LongSong
                  songId={item.attributes.uid}
                  songName={item.attributes.title}
                  artistName={item.attributes.artist}
                  songImage={item.attributes.coverURI}
                />
              </TouchableOpacity>
            );
          })
        : null}
    </ScrollView>
  );
}
