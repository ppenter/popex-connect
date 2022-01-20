import { Slider } from "@miblanchard/react-native-slider";
import { BlurView } from "expo-blur";
import { Block, Card, NavBar, Text } from "galio-framework";
import React, { useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";

export default function Player(props) {
  Icon.loadFont();
  const theme = useThemeContext().theme;
  const playerContext = usePlayerContext();

  if (!playerContext.playlist || !playerContext.playbackInstance) {
    return null;
  }

  const moralis = useMoralisContext().moralis;

  const likes = useMoralisContext().likes;

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }
  const currentSong = playerContext.playlist[playerContext.currentIndex];
  const [isSeek, setIsSeek] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const artistLoad = useMoralisCloudFunction("getUsernameOfAddress", {
    ethAddress: currentSong.attributes.creator.toLowerCase(),
  });

  const styles = StyleSheet.create({
    infoContainer: {
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      padding: 30,
    },
    shadowProp: {
      width: "100%",
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    sliderContainer: {
      alignItems: "stretch",
      justifyContent: "center",
      width: "100%",
      marginTop: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    filter: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    modalView: {
      width: "100%",
      height: "90%",
      alignItems: "center",
      justifyContent: "space-evenly",
      elevation: 5,
      paddingHorizontal: 30,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {},
    textStyle: {
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={playerContext.isModal}
      onRequestClose={() => {}}
    >
      <BlurView intensity={100} tint="dark" style={styles.filter} />
      <NavBar
        transparent
        left={
          <TouchableOpacity
            onPress={(e) => {
              playerContext.closeModal();
            }}
          >
            <Icon color={theme.colors.text} size={50} name={"chevron-down"} />
          </TouchableOpacity>
        }
        rightStyle={{ alignItems: "flex-end" }}
        right={
          moralis.user ? (
            likes.includes(currentSong.attributes.uid) ? (
              //Unlike button
              <TouchableOpacity
                onPress={(e) => {
                  moralis.user.fetch();
                  let templike = [];
                  for (var i in likes) {
                    if (likes[i] !== currentSong.attributes.uid) {
                      templike.push(likes[i]);
                    }
                  }
                  moralis.setUserData({ like: templike }).then(async () => {
                    await timeout(100);
                    moralis.user.fetch();
                  });
                }}
              >
                <Icon color="red" size={40} name={"heart"} />
              </TouchableOpacity>
            ) : (
              //Like button
              <TouchableOpacity
                onPress={(e) => {
                  moralis.user.fetch();
                  let templike = [];
                  for (var i in likes) {
                    templike[i] = likes[i];
                  }
                  templike[likes.length] = currentSong.attributes.uid;
                  moralis.setUserData({ like: templike }).then(async () => {
                    await timeout(100);
                    moralis.user.fetch();
                  });
                }}
              >
                <Icon
                  color={theme.colors.text}
                  size={40}
                  name={"heart-outline"}
                />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              onPress={(e) => {
                alert("Please login");
              }}
            >
              <Icon
                color={theme.colors.disable}
                size={40}
                name={"heart-outline"}
              />
            </TouchableOpacity>
          )
        }
        style={{ marginTop: 60, width: "100%" }}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 40,
            }}
          >
            <Card
              borderless
              image={currentSong.attributes.coverURI}
              style={{ width: 300, height: 300 }}
              imageStyle={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
              }}
            ></Card>
          </View>
          {/** Infomation container */}
          <View style={styles.shadowProp}>
            <View style={styles.infoContainer}>
              <Text h5 numberOfLines={1} color={theme.colors.text}>
                {currentSong.attributes.title}
              </Text>
              <Text
                muted
                numberOfLines={1}
                style={{ maxWidth: "80%", marginTop: 10 }}
              >
                {artistLoad.data
                  ? artistLoad.data
                  : currentSong.attributes.creator}
              </Text>
              {/** Slider */}
              <Block style={styles.sliderContainer}>
                <Slider
                  onValueChange={(e) => {
                    setSeekValue(e);
                  }}
                  onSlidingStart={(e) => {
                    setIsSeek(true);
                  }}
                  onSlidingComplete={async (e) => {
                    playerContext.seekTo(parseInt(e));
                    await timeout(100);
                    setIsSeek(false);
                  }}
                  value={isSeek ? seekValue : playerContext.position}
                  maximumValue={playerContext.duration}
                  thumbTintColor={theme.colors.primary}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.secondary}
                  trackStyle={{ height: 1 }}
                ></Slider>
              </Block>
              <View
                style={{
                  paddingLeft: 0,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                  }}
                  onPress={(e) => {
                    e.preventDefault();
                    playerContext.handlePreviousTrack();
                  }}
                >
                  <Icon
                    name="play-skip-back-sharp"
                    size={40}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
                {playerContext.isPlaying ? (
                  <TouchableOpacity
                    style={{ justifyContent: "center", width: 90, height: 90 }}
                    onPress={(e) => {
                      e.preventDefault();
                      // console.log(moralis.user);
                      playerContext.togglePlay();
                    }}
                  >
                    <Icon
                      name="pause-circle"
                      size={90}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ justifyContent: "center", width: 90, height: 90 }}
                    onPress={(e) => {
                      e.preventDefault();
                      playerContext.togglePlay();
                    }}
                  >
                    <Icon
                      name="play-circle"
                      size={90}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 50, height: 50 }}
                  onPress={(e) => {
                    e.preventDefault();
                    // console.log(likes);
                    playerContext.handleNextTrack();
                  }}
                >
                  <Icon
                    name="play-skip-forward-sharp"
                    size={40}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
