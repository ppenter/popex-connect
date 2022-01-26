import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
import SongCard from "./card";
export default function PlaylistCarousel(props) {
  const { items, width = 160, height = 180 } = props;
  const theme = useThemeContext().theme;
  const mode = useThemeContext().mode;
  const player = usePlayerContext();
  const allName = useMoralisContext().allName;

  if (!items) {
    return null;
  }

  const styles = StyleSheet.create({
    heading: {
      fontSize: 18,
      fontWeight: "600",
    },
    card: {
      width: width,
      height: height,
      marginLeft: 20,
      marginTop: 20,
      borderRadius: 15,
      backgroundColor: theme.colors.backgroundColor,
    },
    shadowProp: {
      shadowColor: "#000000",
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      // elevation: 5,
    },
  });

  const renderItem = ({ item, index }) => (
    <SongCard
      mr={20}
      item={item}
      onPress={(e) => {
        player.playPlaylist(items, index);
      }}
    />
  );

  return (
    <View style={{ marginVertical: 10, paddingLeft: 20 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        data={items}
        renderItem={renderItem}
        horizontal
        extraData={props}
      ></FlatList>
    </View>
  );
}
