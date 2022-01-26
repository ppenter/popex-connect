import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "../../contexts/themeContext";
export default function SwitchThemeButton(props) {
  const themeContext = useThemeContext();
  const theme = useThemeContext().theme;

  return (
    <TouchableOpacity
      onPress={(e) => {
        themeContext.switchTheme();
      }}
    >
      <Icon
        name={themeContext.mode == "dark" ? "moon" : "sunny"}
        size={40}
        color={theme.colors.text}
      ></Icon>
    </TouchableOpacity>
  );
}
