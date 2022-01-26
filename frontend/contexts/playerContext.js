import { Audio } from "expo-av";
import React, { useEffect } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import MusicControl, { Command } from "react-native-music-control";
import { utils } from "../utils";

export const PlayerContext = React.createContext({
  isModal: false,
  isMiniModal: false,
  isPlaylistModal: false,
  isAddToPlaylistModal: false,
  addToPlaylistSongId: -1,
  isPlaying: false,
  isBuffering: false,
  isLoop: true,
  isRepeat: false,
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
  openPlaylistModal: () => null,
  closePlaylistModal: () => null,
  openAddToPlaylistModal: (id) => null,
  closeAddToPlaylistModal: () => null,
  setAddToPlaylistSong: () => null,
  initialize: () => null,
  playPlaylist: () => null,
  togglePlay: () => null,
  seekTo: () => null,
  handlePreviousTrack: () => null,
  handleNextTrack: () => null,
  handleRepeatLoopButton: () => null,
  shufflePlaylistWhilePlaying: () => null,
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
  const [isLoop, setIsLoop] = React.useState(true);
  const [isRepeat, setIsRepeat] = React.useState(false);
  const [isMiniModal, setIsMiniModal] = React.useState(0);
  const [isPlaylistModal, setIsPlaylistModal] = React.useState(false);
  const [isAddToPlaylistModal, setIsAddToPlaylistModal] = React.useState(false);
  const [addToPlaylistSongId, setAddtoPlaylistSongId] = React.useState("test");
  const allName = useMoralisCloudFunction("getUsernameOfAllAddress");

  useEffect(() => {
    if (playbackInstance) {
      playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    if (playlist) {
      setPlaylist((prev) => prev);
    }
  }, [playlist, currentIndex, isLoop, isRepeat]);

  const openPlaylistModal = async (id) => {
    setIsPlaylistModal(true);
  };
  const closePlaylistModal = () => {
    setIsPlaylistModal(false);
  };

  const setAddToPlaylistSong = (id) => {
    setAddToPlaylistSong(id);
  };

  const openAddToPlaylistModal = async (id) => {
    setAddtoPlaylistSongId(id);
    await utils.timeout(100);
    setIsAddToPlaylistModal(true);
  };
  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModal(false);
  };

  const shufflePlaylistWhilePlaying = async () => {
    let exceptIndex = currentIndex;
    let arrayToShuffle = [];
    for (var i = 0; i < playlist.length; i++) {
      arrayToShuffle[i] = playlist[i];
    }

    arrayToShuffle.splice(exceptIndex, 1);

    utils.shuffle(arrayToShuffle);
    let result = [];
    for (var i = 0; i < playlist.length; i++) {
      if (i == currentIndex) {
        result[i] = playlist[i];
      } else if (i > currentIndex) {
        result[i] = arrayToShuffle[i - 1];
      } else {
        result[i] = arrayToShuffle[i];
      }
    }
    await utils.timeout(50).then(setPlaylist(result));
  };

  async function setNowPlaying(_song) {
    await playbackInstance.getStatusAsync().then((e) => {
      MusicControl.setNowPlaying({
        title: _song.attributes.title,
        artwork: _song.attributes.coverURI, // URL or RN's image require()
        artist: allName.data[_song.attributes.creator]
          ? allName.data[_song.attributes.creator].username
          : _song.attributes.creator,
        album: _song.attributes.album,
        genre: _song.attributes.genre,
        duration: e.durationMillis / 1000, // (Seconds)
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
    } catch (e) {
      console.log(e);
    }
  }

  const reset = async () => {
    setIsMiniModal(false);
    try {
      await playbackInstance.pauseAsync();
      await playbackInstance.unloadAsync().then(async () => {
        MusicControl.resetNowPlaying();
      });
      setPlaylist(null);
    } catch (e) {
      console.log(e);
    }
  };

  const playAtIndex = async (_index) => {
    if (playbackInstance && playlist) {
      if (_index <= playlist.length) {
        if (_index >= 0) {
          await playbackInstance.unloadAsync().then(async () => {
            try {
              await playbackInstance
                .loadAsync(
                  { uri: playlist[_index].attributes.hash },
                  { shouldPlay: true }
                )
                .then((e) => {
                  setCurrentIndex(_index);
                  MusicControl.setNowPlaying({
                    title: playlist[_index].attributes.title,
                    artwork: playlist[_index].attributes.coverURI, // URL or RN's image require()
                    artist: allName.data[playlist[_index].attributes.creator]
                      ? allName.data[playlist[_index].attributes.creator]
                          .username
                      : playlist[_index].attributes.creator,
                    album: playlist[_index].attributes.album,
                    genre: playlist[_index].attributes.genre,
                    duration: e.durationMillis / 1000, // (Seconds)
                  });
                });
            } catch {}
          });
        } else {
        }
      }
    }
  };

  const handlePreviousTrack = async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex > 0) {
        playAtIndex((cindex -= 1));
      } else if (isLoop) {
        playAtIndex((cindex = playlist.length - 1));
      }
    }
  };

  const handleNextTrack = async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex < playlist.length - 1) {
        playAtIndex((cindex += 1));
      } else if (isLoop) {
        playAtIndex((cindex = 0));
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
    setIsMiniModal(false);
    await utils.timeout(50);
    setIsMiniModal(true);
    if (_playlist == playlist && index == currentIndex) {
      return null;
    } else {
    }
    try {
      if (playbackInstance._loaded) {
        await playbackInstance.unloadAsync();
      } else {
      }
      await playbackInstance
        .loadAsync(
          { uri: _playlist[index].attributes.hash },
          { shouldPlay: true }
        )
        .then(async () => {
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

  const handleRepeatLoopButton = () => {
    if (!isLoop && !isRepeat) {
      setIsLoop(true);
    } else if (isLoop && !isRepeat) {
      setIsRepeat(true);
    } else {
      setIsRepeat(false);
      setIsLoop(false);
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.didJustFinish) {
      if (isRepeat) {
        playAtIndex(currentIndex);
      } else {
        await handleNextTrack();
      }
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
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      if (cindex < playlist.length - 1) {
        playAtIndex((cindex += 1));
      } else if (isLoop) {
        playAtIndex((cindex = 0));
      }
    }
  });

  MusicControl.on(Command.previousTrack, async () => {
    if (playbackInstance && playlist) {
      let cindex = currentIndex;
      console.log(cindex);
      if (cindex > 0) {
        playAtIndex((cindex -= 1));
      } else if (isLoop) {
        playAtIndex((cindex = playlist.length - 1));
      }
    }
  });

  const value = {
    isModal: modalVisible,
    isPlaylistModal: isPlaylistModal,
    isPlaying: isPlaying,
    isAddToPlaylistModal: isAddToPlaylistModal,
    addToPlaylistSongId: addToPlaylistSongId,
    isBuffering: isBuffering,
    isLoop: isLoop,
    isRepeat: isRepeat,
    currentIndex: currentIndex,
    duration: duration,
    position: position,
    playbackInstance: playbackInstance,
    playlist: playlist,
    isMiniModal: isMiniModal,
    playPlaylist,
    openModal,
    closeModal,
    openPlaylistModal,
    closePlaylistModal,
    openAddToPlaylistModal,
    closeAddToPlaylistModal,
    setAddToPlaylistSong,
    initialize,
    togglePlay,
    pause,
    seekTo,
    handlePreviousTrack,
    handleNextTrack,
    handleRepeatLoopButton,
    shufflePlaylistWhilePlaying,
    reset,
  };

  return (
    <PlayerContext.Provider value={value}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => React.useContext(PlayerContext);
