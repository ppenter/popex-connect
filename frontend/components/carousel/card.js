import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function SongCard(props) {
  const { item, onPress, width = 160, height = 180, mr = 0 } = props;
  const theme = useThemeContext().theme;
  const player = usePlayerContext();
  const allName = useMoralisContext().allName;

  const styles = StyleSheet.create({
    heading: {
      fontSize: 18,
      fontWeight: "600",
    },
    card: {
      width: width,
      height: height,
      borderRadius: 15,
      marginRight: mr,
    },
    shadowProp: {
      shadowColor: "#000000",
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      // elevation: 5,
    },
  });
  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
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
          <Text
            bold
            size={16}
            color={"white"}
            numberOfLines={1}
            style={{ maxWidth: "90%" }}
          >
            {item.attributes.title}
          </Text>
          <Text
            mute
            numberOfLines={1}
            size={12}
            color={"#E4E4E4"}
            style={{ maxWidth: "90%" }}
          >
            {allName[item.attributes.creator]
              ? allName[item.attributes.creator].username
              : item.attributes.creator}
          </Text>
        </BlurView>
      </Card>
    </TouchableOpacity>
  );
}
