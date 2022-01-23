import { Slider } from "@miblanchard/react-native-slider";
import { BlurView } from "expo-blur";
import { Block, Card, NavBar, Text } from "galio-framework";
import React, { useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useMoralisContext } from "../../contexts/moralisContext";
import { usePlayerContext } from "../../contexts/playerContext";
import { useThemeContext } from "../../contexts/themeContext";
import LikeButton from "../button/likeButton";

const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 30,
  },
  shadowProp: {
    width: "100%",
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
    paddingHorizontal: 0,
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

export default function Player(props) {
  Icon.loadFont();
  const theme = useThemeContext().theme;
  const mode = useThemeContext().mode;
  const playerContext = usePlayerContext();

  if (!playerContext.playlist || !playerContext.playbackInstance) {
    return null;
  }

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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

  const handleRepeatLoopButton = () => {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={playerContext.isModal}
      onRequestClose={() => {}}
    >
      <BlurView intensity={100} tint={mode} style={styles.filter} />
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
        right={<LikeButton songId={currentSong.attributes.uid} />}
        style={{ marginTop: 60, width: "100%" }}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 30,
            }}
          >
            <Card
              borderless
              image={
                playerContext.playbackInstance._loaded
                  ? currentSong.attributes.coverURI
                  : ""
              }
              style={{ width: "100%", aspectRatio: 1 }}
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
              <Text h5 bold numberOfLines={1} color={theme.colors.text}>
                {playerContext.playbackInstance._loaded
                  ? currentSong.attributes.title
                  : " "}
              </Text>
              <Text
                muted
                numberOfLines={1}
                style={{ maxWidth: "80%", marginTop: 10 }}
              >
                {playerContext.playbackInstance._loaded
                  ? artistLoad.data
                    ? artistLoad.data
                    : currentSong.attributes.creator
                  : " "}
              </Text>
              {/** Slider */}
              <Block style={styles.sliderContainer}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text color={theme.colors.text}>
                    {playerContext.position
                      ? isSeek
                        ? millisToMinutesAndSeconds(seekValue)
                        : millisToMinutesAndSeconds(playerContext.position)
                      : "0:00"}
                  </Text>
                  <Text color={theme.colors.text}>
                    {playerContext.duration
                      ? millisToMinutesAndSeconds(playerContext.duration)
                      : "0:00"}
                  </Text>
                </View>

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
                  trackStyle={{ height: 4 }}
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
                {/* Repeat one icon */}
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 30, height: 30 }}
                  onPress={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Icon name="shuffle" size={30} color={theme.colors.disable} />
                </TouchableOpacity>
                {/* Repeat one icon */}

                {/* Skip back icon */}
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
                {/* Skip back icon */}

                {/* Pause & pause icon */}
                {playerContext.isPlaying ? (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      width: 90,
                      height: 90,
                      padding: 15,
                    }}
                    onPress={(e) => {
                      e.preventDefault();
                      playerContext.togglePlay();
                    }}
                  >
                    <Icon name="pause" size={60} color={theme.colors.text} />
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
                {/* Pause & pause icon */}

                {/* Skip forward icon */}
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 50, height: 50 }}
                  onPress={(e) => {
                    e.preventDefault();
                    playerContext.handleNextTrack();
                  }}
                >
                  <Icon
                    name="play-skip-forward-sharp"
                    size={40}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
                {/* Skip forward icon */}

                {/* Repeat one icon */}
                <TouchableOpacity
                  style={{ justifyContent: "center", width: 30, height: 30 }}
                  onPress={(e) => {
                    e.preventDefault();
                    handleRepeatLoopButton();
                  }}
                >
                  <MaterialIcon
                    name={playerContext.isRepeat ? "repeat-one" : "repeat"}
                    size={30}
                    color={
                      playerContext.isLoop || playerContext.isRepeat
                        ? theme.colors.text
                        : theme.colors.disable
                    }
                  />
                </TouchableOpacity>
                {/* Repeat one icon */}
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              ></View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
