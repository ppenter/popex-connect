import { Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { View } from "react-native";
import { PlaylistCarousel } from "../components/carousel";
import { useContractContext } from "../contexts/contractContext";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function HomeScreen({ navigation }) {
  const [resentSongs, setRecentSongs] = React.useState(null);
  const contracts = useContractContext();
  const player = usePlayerContext();
  const moralisSong = useMoralisQuery("popexUpload", (query) =>
    query.descending("uid").limit(25)
  );

  const loadSong = () => {
    let allSongs = [];
    for (let i = 0; i < moralisSong.data.length; i++) {
      let song = moralisSong.data[i].attributes;

      allSongs[i] = {
        id: song.uid,
        url: song.hash,
        title: song.title,
        genre: song.genre,
        album: song.album,
        artist: song.creator,
        date: song.created,
        artwork: song.coverURI,
      };
    }

    setRecentSongs(allSongs);
    console.log("allsongs: ", allSongs);
  };

  React.useEffect(() => {
    if (moralisSong.data) {
      loadSong();
    }
  }, [moralisSong.data]);

  const contractsData = useContractContext();
  const theme = useThemeContext().theme;
  // console.log(contractsData.allsong);
  return (
    <View style={{ paddingTop: 0 }}>
      <Text h3 bold color={theme.colors.text} style={{ left: 20 }}>
        New Release
      </Text>
      <PlaylistCarousel items={resentSongs}></PlaylistCarousel>
    </View>
  );
}
