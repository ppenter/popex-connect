import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useMoralisContext } from "../contexts/moralisContext";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function FavoriteScreen() {
  const theme = useThemeContext().theme;
  const moralis = useMoralisContext().moralis;
  const player = usePlayerContext();
  const likes = useMoralisContext().likes;

  if (!moralis.user) {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Icon name="heart" color="red" size={40}></Icon>
          <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
            Favorite
          </Text>
        </View>
      </View>
    );
  }

  const allName = useMoralisContext().allName;
  // const allName = useMoralisCloudFunction("getUsernameOfAllAddress");

  // if (!allName.data) {
  //   return null;
  // }

  const likesSongData = useMoralisQuery(
    "popexUpload",
    (query) =>
      query.containedIn(
        "uid",
        moralis.user ? moralis.user.attributes.like : []
      ),
    [likes]
  );

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row" }}>
        <Icon name="heart" color="red" size={40}></Icon>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          Favorite
        </Text>
      </View>
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
                <TouchableOpacity
                  onPress={(e) => {
                    player.playPlaylist(likesSongData.data, index);
                  }}
                >
                  <Card
                    borderless
                    style={{ width: 150, height: 150, padding: 0 }}
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
                      <Text p bold color={theme.colors.text}>
                        {item.attributes.title}
                      </Text>
                      <Text mute numberOfLines={1} color={theme.colors.text}>
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
    </View>
  );
}
