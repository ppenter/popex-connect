import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { View } from "react-native";
import SongCard from "../components/carousel/card";
import { useMoralisContext } from "../contexts/moralisContext";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function FavoriteScreenObject() {
  const theme = useThemeContext().theme;
  const moralis = useMoralisContext().moralis;
  const player = usePlayerContext();
  const likes = useMoralisContext().likes;

  const allName = useMoralisContext().allName;

  const likesSongData = useMoralisQuery(
    "popexUpload",
    (query) => query.containedIn("uid", moralis.user ? likes : []),
    [likes]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginTop: 20,
      }}
    >
      {likesSongData.data
        ? likesSongData.data.map((item, index) => {
            return (
              <SongCard
                key={item.attributes.uid}
                item={item}
                onPress={(e) => {
                  player.playPlaylist(likesSongData.data, index);
                }}
              />
            );
          })
        : null}
    </View>
  );
}
