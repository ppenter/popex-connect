import { Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
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
    // console.log("allsongs: ", allSongs);
  };

  React.useEffect(() => {
    if (moralisSong.data) {
      loadSong();
    }
  }, [moralisSong.data]);

  const contractsData = useContractContext();
  const theme = useThemeContext().theme;
  const genre = [
    { name: "hiphop", color: "#6059F7" },
    { name: "lofi", color: "#6692FF" },
    { name: "rock", color: "#37C3FF" },
    { name: "pop", color: "#8D60FF" },
    { name: "metal", color: "#6059F7" },
    { name: "jazz", color: "#6692FF" },
    { name: "indy", color: "#37C3FF" },
    { name: "rap", color: "#8D60FF" },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 0 }}>
      <View
        style={{ flexDirection: "row", paddingLeft: 20, alignItems: "center" }}
      >
        <Icon name="disc" color={theme.colors.primary} size={40}></Icon>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          Explore
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.preventDefault();
            navigation.navigate("Search");
          }}
          style={{
            right: 0,
            position: "absolute",
            width: 40,
            height: 40,
            marginRight: 10,
          }}
        >
          <Icon name="search" color={theme.colors.text} size={30}></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", paddingLeft: 20, marginTop: 10 }}>
        <Text h4 bold color={theme.colors.text}>
          New Release
        </Text>
      </View>
      <PlaylistCarousel
        name="New Release"
        items={moralisSong.data ? moralisSong.data : []}
      ></PlaylistCarousel>
      <View style={{ flexDirection: "row", paddingLeft: 20 }}>
        <Text h4 bold color={theme.colors.text}>
          Genre
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {genre.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.name}
              onPress={(e) => {
                navigation.navigate("GenrePlaylist", { name: item.name });
              }}
            >
              <View
                style={{
                  width: 150,
                  height: 150,
                  padding: 0,
                  marginBottom: 20,
                  shadowColor: "#000000",
                  shadowOffset: { width: 6, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 3,
                  backgroundColor: item.color,
                  borderRadius: 7,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                  }}
                >
                  <Text p bold color={"white"} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
