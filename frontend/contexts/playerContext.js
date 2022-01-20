import { Audio } from "expo-av";
import React from "react";
import { useMoralisCloudFunction } from "react-moralis";
import MusicControl, { Command } from "react-native-music-control";

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
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");

  async function setNowPlaying(_song) {
    const _songDuration = await playbackInstance.getStatusAsync().then((e) => {
      MusicControl.setNowPlaying({
        title: _song.attributes.title,
        artwork: _song.attributes.coverURI, // URL or RN's image require()
        artist: allName.data[_song.attributes.creator]
          ? allName.data[_song.attributes.creator].username
          : _song.attributes.creator,
        album: _song.attributes.album,
        genre: _song.attributes.genre,
        duration: e.durationMillis / 1000, // (Seconds)
        // description: "", // Android Only
        // color: 0xffffff, // Android Only - Notification Color
        // colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
        // date: "1983-01-02T00:00:00Z", // Release Date (RFC 3339) - Android Only
        // rating: 84, // Android Only (Boolean or Number depending on the type)
        // notificationIcon: "my_custom_icon", // Android Only (String), Android Drawable resource name for a custom notification icon
        // isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
      });
    });
  }

  async function initialize() {
    try {
      await Audio.setAudioModeAsync({
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const playbackObject = new Audio.Sound();
      // await playbackObject.setVolumeAsync(0.5);
      setPlaybacknstance(playbackObject);

      console.log(playbackObject);
    } catch (e) {
      console.log(e);
    }
  }

  const reset = async () => {
    try {
      await playbackInstance.pauseAsync();
      await playbackInstance.unloadAsync().then(async () => {
        MusicControl.resetNowPlaying();
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handlePreviousTrack = async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex > 0) {
        await playbackInstance.unloadAsync().then(async () => {
          try {
            await playbackInstance
              .loadAsync(
                { uri: playlist[(cindex -= 1)].attributes.hash },
                { shouldPlay: true }
              )
              .then((e) => {
                setCurrentIndex(cindex);
                MusicControl.setNowPlaying({
                  title: playlist[cindex].attributes.title,
                  artwork: playlist[cindex].attributes.coverURI, // URL or RN's image require()
                  artist: allName.data[playlist[cindex].attributes.creator]
                    ? allName.data[playlist[cindex].attributes.creator].username
                    : playlist[cindex].attributes.creator,
                  album: playlist[cindex].attributes.album,
                  genre: playlist[cindex].attributes.genre,
                  duration: e.durationMillis / 1000, // (Seconds)
                });
              });
          } catch {}
        });
      } else {
      }
    }
  };

  const handleNextTrack = async () => {
    if (playbackInstance && playlist.length > 0) {
      let cindex = currentIndex;
      if (cindex < playlist.length - 1) {
        await playbackInstance.unloadAsync().then(async () => {
          try {
            await playbackInstance
              .loadAsync(
                { uri: playlist[(cindex += 1)].attributes.hash },
                { shouldPlay: true }
              )
              .then((e) => {
                setCurrentIndex(cindex);
                MusicControl.setNowPlaying({
                  title: playlist[cindex].attributes.title,
                  artwork: playlist[cindex].attributes.coverURI, // URL or RN's image require()
                  artist: allName.data[playlist[cindex].attributes.creator]
                    ? allName.data[playlist[cindex].attributes.creator].username
                    : playlist[cindex].attributes.creator,
                  album: playlist[cindex].attributes.album,
                  genre: playlist[cindex].attributes.genre,
                  duration: e.durationMillis / 1000, // (Seconds)
                });
              });
          } catch (e) {
            console.log(e);
          }
        });
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
        .loadAsync(
          { uri: _playlist[index].attributes.hash },
          { shouldPlay: true }
        )
        .then(() => {
          setNowPlaying(_playlist[index]);
          setPlaylist(_playlist);
          setCurrentIndex(index);
        });
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const seekTo = async (_position) => {
    try {
      await playbackInstance.setPositionAsync(_position).then(async (e) => {
        MusicControl.updatePlayback({
          elapsedTime: e.positionMillis / 1000,
        });
      });
      await playbackInstance.playAsync().then(async (e) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
        });
      });
    } catch {}
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.didJustFinish) {
      handleNextTrack();
    }
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  // Music Control //

  MusicControl.handleAudioInterruptions(true);
  MusicControl.enableBackgroundMode(true);
  MusicControl.enableControl(Command.changePlaybackPosition, true);
  MusicControl.enableControl(Command.play, true);
  MusicControl.enableControl(Command.pause, true);
  MusicControl.enableControl("nextTrack", true);
  MusicControl.enableControl("previousTrack", true);
  MusicControl.enableControl(Command.closeNotification, true, {
    when: "always",
  });

  MusicControl.on(Command.play, async () => {
    try {
      isPlaying
        ? await playbackInstance.pauseAsync()
        : await playbackInstance.playAsync();
    } catch {}
  });
  MusicControl.on(Command.pause, async () => {
    try {
      isPlaying
        ? await playbackInstance.pauseAsync()
        : await playbackInstance.playAsync();
    } catch {}
  });
  MusicControl.on(Command.changePlaybackPosition, async (_position) => {
    try {
      await playbackInstance
        .setPositionAsync(parseInt(_position * 1000))
        .then(async (e) => {
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: e.positionMillis / 1000,
          });
        });
      await playbackInstance.playAsync();
    } catch (e) {
      alert(e);
    }
  });
  MusicControl.on(Command.nextTrack, async () => {
    if (playbackInstance && playlist.length > 0) {
      let cindex = currentIndex;
      if (cindex < playlist.length - 1) {
        await playbackInstance.unloadAsync().then(async () => {
          try {
            await playbackInstance
              .loadAsync(
                { uri: playlist[(cindex += 1)].attributes.hash },
                { shouldPlay: true }
              )
              .then((e) => {
                setCurrentIndex(cindex);
                MusicControl.setNowPlaying({
                  title: playlist[cindex].attributes.title,
                  artwork: playlist[cindex].attributes.coverURI, // URL or RN's image require()
                  artist: allName.data[playlist[cindex].attributes.creator]
                    ? allName.data[playlist[cindex].attributes.creator].username
                    : playlist[cindex].attributes.creator,
                  album: playlist[cindex].attributes.album,
                  genre: playlist[cindex].attributes.genre,
                  duration: e.durationMillis / 1000, // (Seconds)
                });
              });
          } catch (e) {
            console.log(e);
          }
        });
      } else {
      }
    }
  });

  MusicControl.on(Command.previousTrack, async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex > 0) {
        await playbackInstance.unloadAsync().then(async () => {
          try {
            await playbackInstance
              .loadAsync(
                { uri: playlist[(cindex -= 1)].attributes.hash },
                { shouldPlay: true }
              )
              .then((e) => {
                setCurrentIndex(cindex);
                MusicControl.setNowPlaying({
                  title: playlist[cindex].attributes.title,
                  artwork: playlist[cindex].attributes.coverURI, // URL or RN's image require()
                  artist: allName.data[playlist[cindex].attributes.creator]
                    ? allName.data[playlist[cindex].attributes.creator].username
                    : playlist[cindex].attributes.creator,
                  album: playlist[cindex].attributes.album,
                  genre: playlist[cindex].attributes.genre,
                  duration: e.durationMillis / 1000, // (Seconds)
                });
              });
          } catch {}
        });
      } else {
      }
    }
  });

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
