import { BlurView } from "expo-blur";
import { Card, Text } from "galio-framework";
import * as React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { useGlobalContext } from "../contexts/globalContext";
import { useThemeContext } from "../contexts/themeContext";
import { utils } from "../utils";

export default function PlaylistScreenObject({ navigation, route }) {
  let actionSheet = React.useRef();
  const theme = useThemeContext().theme;
  const moralis = useMoralis();
  const global = useGlobalContext();
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);

  const playlist = useMoralisQuery(
    "Playlist",
    (query) =>
      query
        .equalTo("userCreatedAt", moralis.user ? moralis.user.createdAt : "")
        .equalTo("creatorId", moralis.user ? moralis.user.id : ""),
    [global.trigger, moralis.user]
  );

  if (!moralis.user || !playlist.data) {
    return null;
  }

  const removeSongInPlaylist = async (_playlistId) => {
    const SongInPlaylist = moralis.Moralis.Object.extend("SongInPlaylist");
    const query = new moralis.Moralis.Query(SongInPlaylist);
    query.equalTo("playlistId", _playlistId);
    const object = await query.find();
    console.log(object);
    if (object.length > 0) {
      for (var i = 0; i < object.length; i++) {
        object[i].destroy();
      }
    }
  };

  const removePlaylist = async (id) => {
    const Playlist = moralis.Moralis.Object.extend("Playlist");
    const query = new moralis.Moralis.Query(Playlist);
    query.equalTo("objectId", id);
    const object = await query.find();
    console.log(object);
    if (object.length > 0) {
      for (var i = 0; i < object.length; i++) {
        object[i].destroy();
      }
    }
    removeSongInPlaylist(id);
    await utils.timeout(100);
    global.toggleTrigger();
  };

  const handleLongPress = (item) => {
    setSelectedPlaylist(item);
    actionSheet.current.show();
  };
  const handlePress = async (item) => {
    navigation.navigate("PlaylistInformationStack", {
      playlist: item,
    });
  };

  return (
    <View style={{ minHeight: "90%" }}>
      {/* <Button
        onPress={(e) => {
          console.log(playlist.data[0].attributes.creatorId);
        }}
      ></Button> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {playlist.data.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              onLongPress={(e) => {
                e.preventDefault();
                handleLongPress(item);
              }}
              onPress={(e) => {
                e.preventDefault();
                handlePress(item);
              }}
            >
              <Card
                borderless
                style={{
                  width: 150,
                  height: 150,
                  marginBottom: 20,
                  backgroundColor: theme.colors.secondary,
                }}
                image={""}
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
                    {item.attributes.name}
                  </Text>
                </BlurView>
              </Card>
              {selectedPlaylist ? (
                <ActionSheet
                  ref={actionSheet}
                  // Title of the Bottom Sheet
                  title={selectedPlaylist.attributes.name}
                  // Options Array to show in bottom sheet
                  options={["Delete", "Cancel"]}
                  // Define cancel button index in the option array
                  // This will take the cancel option in bottom
                  // and will highlight it
                  cancelButtonIndex={1}
                  // Highlight any specific option
                  destructiveButtonIndex={0}
                  onPress={(index) => {
                    if (index == 0) {
                      console.log(selectedPlaylist.id);
                      removePlaylist(selectedPlaylist.id);
                    }
                    // Clicking on the option will give you alert
                  }}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
