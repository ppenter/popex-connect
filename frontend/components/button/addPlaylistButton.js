import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";
import Icon from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../contexts/globalContext";
import { useThemeContext } from "../../contexts/themeContext";
export default function AddPlaylistButton(props) {
  const theme = useThemeContext().theme;
  const global = useGlobalContext();
  const [isPopup, setIsPopup] = useState(false);
  const [nameOfNewPlaylist, setNameOfNewPlaylist] = useState("");

  const moralis = useMoralis();

  if (!moralis.Moralis.User.current()) {
    return null;
  }

  const addPlaylist = (name) => {
    const Playlist = moralis.Moralis.Object.extend("Playlist");
    const newPlaylist = new Playlist();
    newPlaylist.set("name", name);
    newPlaylist.set("userCreatedAt", moralis.Moralis.User.current().createdAt);
    newPlaylist.set("creatorId", moralis.Moralis.User.current().id);
    const ACL = new moralis.Moralis.ACL();
    ACL.setPublicReadAccess(true);
    ACL.setWriteAccess(moralis.Moralis.User.current(), true);
    newPlaylist.setACL(ACL);
    newPlaylist.save();
    global.toggleTrigger();
  };

  return (
    <View>
      <Dialog.Container visible={isPopup}>
        <Dialog.Title>New Playlist</Dialog.Title>
        <Dialog.Description>Name your new playlist</Dialog.Description>
        <Dialog.Input
          onChangeText={(e) => {
            setNameOfNewPlaylist(e);
          }}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setIsPopup(false);
          }}
        />
        <Dialog.Button
          disabled={nameOfNewPlaylist == ""}
          onPress={() => {
            addPlaylist(nameOfNewPlaylist);
            setIsPopup(false);
          }}
          label="Create"
        />
      </Dialog.Container>
      <TouchableOpacity
        onPress={() => {
          setNameOfNewPlaylist("");
          setIsPopup(true);
        }}
        style={{
          paddingLeft: 0,
          paddingVertical: 0,
          height: 50,
          width: 50,
          justifyContent: "center",
        }}
      >
        <Icon name="add" size={50} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
}
