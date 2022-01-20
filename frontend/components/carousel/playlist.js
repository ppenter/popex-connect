import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import React, { useEffect } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { FlatList, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function PlaylistCarousel(props) {
  const { items, width = 160, height = 180 } = props;
  const theme = useThemeContext().theme;
  const player = usePlayerContext();
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");
  useEffect(() => {
    console.log(allName.data);
  }, [allName.data]);

  if (!items || !allName.data) {
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
    <TouchableOpacity
      onPress={(e) => {
        player.playPlaylist(items, index);
      }}
      style={[styles.card, styles.shadowProp]}
    >
      <Card
        borderless
        style={{ width: 150, height: 150, padding: 0 }}
        image={item.artwork}
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
            {item.title}
          </Text>
          <Text mute numberOfLines={1} color={theme.colors.text}>
            {allName.data[item.artist]
              ? allName.data[item.artist].username
              : item.artist}
          </Text>
        </BlurView>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
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
