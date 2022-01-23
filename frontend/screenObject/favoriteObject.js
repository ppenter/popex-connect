import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { TouchableOpacity, View } from "react-native";
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
        minHeight: "100%",
      }}
    >
      {likesSongData.data
        ? likesSongData.data.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.attributes.uid}
                onPress={(e) => {
                  player.playPlaylist(likesSongData.data, index);
                }}
              >
                <Card
                  borderless
                  style={{
                    width: 150,
                    height: 150,
                    padding: 0,
                    marginBottom: 20,
                  }}
                  image={item.attributes.coverURI}
                  imageStyle={{ width: "100%", height: "100%" }}
                >
                  <BlurView
                    intensity={30}
                    tint="dark"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: 40,
                      bottom: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text bold size={16} color={"white"} numberOfLines={1}>
                      {item.attributes.title}
                    </Text>
                    <Text mute numberOfLines={1} color={"white"}>
                      {allName[item.attributes.creator]
                        ? allName[item.attributes.creator].username
                        : item.attributes.creator}
                    </Text>
                  </BlurView>
                </Card>
              </TouchableOpacity>
            );
          })
        : null}
    </View>
  );
}
