import { Text } from "galio-framework";
import * as React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { ScrollView, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useMoralisContext } from "../contexts/moralisContext";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";
import FavoriteScreenObject from "../screenObject/favoriteObject";

export default function FavoriteScreen() {
  const theme = useThemeContext().theme;
  const moralis = useMoralis();
  const player = usePlayerContext();
  const likes = useMoralisContext().likes;

  const allName = useMoralisContext().allName;

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 20 }}
    >
      <View style={{ flexDirection: "row" }}>
        <Icon name="heart" color={theme.colors.primary} size={40}></Icon>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          Favorite
        </Text>
      </View>
      <FavoriteScreenObject></FavoriteScreenObject>
    </ScrollView>
  );
}
