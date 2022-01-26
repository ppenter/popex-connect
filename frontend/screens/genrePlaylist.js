import { Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { ScrollView, TouchableOpacity, View } from "react-native";
import LongSong from "../components/button/longSong";
import Footer from "../components/navigation/footer";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function GenrePlaylist({ navigation, route }) {
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();
  const songByGenre = useMoralisQuery("popexUpload", (query) =>
    query.equalTo("genre", route.params.name)
  );
  const mode = useThemeContext().mode;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        paddingHorizontal: 20,
        paddingTop: 80,
        marginBottom: 150,
        minHeight: "100%",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 150,
            height: 150,
            padding: 0,
            marginBottom: 20,
            shadowColor: mode == "dark" ? "#000000" : theme.colors.secondary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 1,
            backgroundColor: theme.colors.secondary,
            borderRadius: 7,
          }}
        >
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <Text p bold color={theme.colors.card} numberOfLines={1}>
              {route.params.name}
            </Text>
          </View>
        </View>
      </View>
      {songByGenre.data
        ? songByGenre.data.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.attributes.uid}
                onPress={(e) => {
                  e.stopPropagation();
                  playerContext.playPlaylist(songByGenre.data, index);
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
      <Footer />
    </ScrollView>
  );
}
