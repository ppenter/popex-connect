import * as React from "react";
import { ScrollView } from "react-native";
import { useThemeContext } from "../contexts/themeContext";

export default function PlaylistInformationScreen({ navigation }) {
  const theme = useThemeContext().theme;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 20 }}
    ></ScrollView>
  );
}
