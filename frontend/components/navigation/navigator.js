import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useMoralis } from "react-moralis";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import {
  FavoriteScreen,
  HomeScreen,
  PlaylistScreen,
  ProfileScreen,
} from "../../screens";
import GenrePlaylist from "../../screens/genrePlaylist";
import PlaylistInformationScreen from "../../screens/playlistInformation";
import SearchScreen from "../../screens/search";
import AddPlaylistButton from "../button/addPlaylistButton";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
Icon.loadFont();

const HomeStackNavigator = ({ navigation, route }) => {
  const theme = route.params.theme;
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTitleStyle: { display: "none" },
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <TouchableOpacity
            onPress={navigation.goBack}
            style={{ marginLeft: 15, paddingTop: 10 }}
          >
            <Icon
              size={40}
              name="chevron-back"
              color={theme.colors.text}
            ></Icon>
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="Explore" component={HomeScreen} />
      <Stack.Screen name="GenrePlaylist" component={GenrePlaylist} />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name="Search"
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};

const FavoriteStackNavigator = ({ navigation, route }) => {
  const theme = route.params.theme;
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTitleStyle: { display: "none" },
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
      })}
    >
      <Stack.Screen name="FavoriteStack" component={FavoriteScreen} />
    </Stack.Navigator>
  );
};

const PlaylistStackNavigator = ({ navigation, route }) => {
  const theme = route.params.theme;
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTitleStyle: { display: "none" },
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
      })}
    >
      <Stack.Screen name="PlaylistStack" component={PlaylistScreen} />
      <Stack.Screen
        name="PlaylistInformationStack"
        component={PlaylistInformationScreen}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = ({ navigation, route }) => {
  const theme = route.params.theme;
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTitleStyle: { display: "none" },
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
      })}
    >
      <Stack.Screen name="ProfileStack" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default function TabNav(props) {
  const moralis = useMoralis();
  const theme = props.theme;
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ navigation, route }) => ({
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            height: 50,
            padding: 0,
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          tabBarIconStyle: { padding: 0, height: 90 },
          tabBarBadgeStyle: { height: 100 },
          headerShown: false,
          headerTitleStyle: { display: "none" },
          headerStyle: {
            backgroundColor: "transparent",
          },
          tabBarItemStyle: { height: 50, justifyContent: "center" },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Favorite") {
              iconName = "star";
            } else if (route.name === "Playlist") {
              iconName = "musical-notes";
            } else if (route.name === "Profile") {
              iconName = "person-circle";
            }

            // You can return any component that you like here!
            return (
              <View style={{ height: "100%", justifyContent: "center" }}>
                <Icon
                  name={iconName}
                  size={size}
                  color={focused ? theme.colors.primary : theme.colors.disable}
                />
              </View>
            );
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
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          initialParams={{ theme: theme }}
        />
        {moralis.user ? (
          <Tab.Screen
            name="Favorite"
            component={FavoriteStackNavigator}
            initialParams={{ theme: theme }}
          />
        ) : null}

        {moralis.user ? (
          <Tab.Screen
            options={{
              headerRight: () => <AddPlaylistButton />,
            }}
            name="Playlist"
            component={PlaylistStackNavigator}
            initialParams={{ theme: theme }}
          />
        ) : null}

        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          initialParams={{ theme: theme }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
