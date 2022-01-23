import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
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
    <TouchableOpacity
      onPress={(e) => {
        player.playPlaylist(items, index);
      }}
      style={[styles.card, styles.shadowProp]}
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

  return (
    <View>
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
