import { Audio } from "expo-av";
import React from "react";

export const PlayerContext = React.createContext({
  isModal: false,
  isPlaying: false,
  isBuffering: false,
  playbackInstance: null,
  currentIndex: 0,
  duration: 0,
  position: 0,
  volume: 1.0,
  playlist: [],
  isBuffering: false,
  play: (track) => null,
  pause: () => null,
  reset: () => null,
  seekAndPlay: (position) => null,
  openModal: () => null,
  closeModal: () => null,
  initialize: () => null,
  playPlaylist: () => null,
  togglePlay: () => null,
  seekTo: () => null,
  handlePreviousTrack: () => null,
  handleNextTrack: () => null,
  reset: () => null,
});

export const PlayerContextProvider = (props) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [playlist, setPlaylist] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [playbackInstance, setPlaybacknstance] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);

  async function initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
      });
      const playbackObject = new Audio.Sound();
      setPlaybacknstance(playbackObject);
      console.log(playbackObject);
    } catch (e) {
      console.log(e);
    }
  }

  const reset = async () => {
    try {
      await playbackInstance.pauseAsync();
      await playbackInstance.unloadAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const handlePreviousTrack = async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex > 0) {
        await playbackInstance.unloadAsync();
        console.log("have instance");

        cindex > 0
          ? setCurrentIndex((cindex -= 1))
          : setCurrentIndex((cindex = 0));
        try {
          await playbackInstance.loadAsync(
            { uri: playlist[cindex].url },
            { shouldPlay: true }
          );
        } catch {}
      } else {
      }
    }
  };

  const handleNextTrack = async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex < playlist.length - 1) {
        await playbackInstance.unloadAsync();
        console.log("have instance");

        cindex < playlist.length - 1
          ? setCurrentIndex((cindex += 1))
          : setCurrentIndex((cindex = playlist.length - 1));
        try {
          await playbackInstance.loadAsync(
            { uri: playlist[cindex].url },
            { shouldPlay: true }
          );
        } catch {}
      } else {
      }
    }
  };

  const pause = async () => {
    await playbackInstance.pauseAsync();
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const togglePlay = async () => {
    try {
      isPlaying
        ? await playbackInstance.pauseAsync()
        : await playbackInstance.playAsync();
    } catch {}
  };

  const playPlaylist = async (_playlist, index) => {
    try {
      if (playbackInstance._loaded) {
        await playbackInstance.unloadAsync();
      }
      playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      await playbackInstance
        .loadAsync({ uri: _playlist[index].url }, { shouldPlay: true })
        .then(() => {
          setPlaylist(_playlist);
          setCurrentIndex(index);
        });
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const seekTo = async (_position) => {
    try {
      await playbackInstance.setPositionAsync(_position);
      await playbackInstance.playAsync();
    } catch {}
  };

  const onPlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  const value = {
    isModal: modalVisible,
    isPlaying: isPlaying,
    isBuffering: isBuffering,
    currentIndex: currentIndex,
    duration: duration,
    position: position,
    playbackInstance: playbackInstance,
    playlist: playlist,
    playPlaylist,
    openModal,
    closeModal,
    initialize,
    togglePlay,
    pause,
    seekTo,
    handlePreviousTrack,
    handleNextTrack,
    reset,
  };

  return (
    <PlayerContext.Provider value={value}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => React.useContext(PlayerContext);
