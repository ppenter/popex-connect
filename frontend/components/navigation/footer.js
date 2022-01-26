import React from "react";
import { View } from "react-native";
export default function Footer(props) {
  const { height = 150 } = props;
  return <View style={{ height: height }}></View>;
}
