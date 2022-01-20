import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { MiniPlayer, Player } from './components/musicPlayer';
import TabNav from './components/navigation/navigator';
import { useContractContext } from './contexts/contractContext';
import { useGlobalContext } from './contexts/globalContext';
import { usePlayerContext } from './contexts/playerContext';
import { useThemeContext } from './contexts/themeContext';

export default function Index() {
  const theme = useThemeContext();
  const global = useGlobalContext();
  const contract = useContractContext();
  const player = usePlayerContext();

  useEffect(() => {
    player.initialize();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.mode == 'dark' ? 'light-content' : 'dark-content'}
      />
      <TabNav theme={theme.theme}></TabNav>
      <MiniPlayer />
      <Player />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
