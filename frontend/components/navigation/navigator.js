import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import {
  FavoriteScreen,
  HomeScreen,
  PlaylistScreen,
  ProfileScreen,
} from "../../screens";

const Drawer = createDrawerNavigator();

export default function TabNav(props) {
  Icon.loadFont();
  const theme = props.theme;

  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: true,
          drawerActiveBackgroundColor: theme.colors.primary,
          drawerLabelStyle: { fontSize: 18, color: theme.colors.text },
          drawerStyle: {
            backgroundColor: theme.colors.background,
            width: 240,
          },
          headerTitleStyle: { display: "none" },
          headerStyle: {
            backgroundColor: "transparent",
            height: 120,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
              style={{
                paddingLeft: 20,
                paddingVertical: 0,
                height: 80,
                width: 80,
                justifyContent: "center",
              }}
            >
              <Icon name="menu" size={40} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Favorite" component={FavoriteScreen} />
        <Drawer.Screen name="Playlist" component={PlaylistScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
