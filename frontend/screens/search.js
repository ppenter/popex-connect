import { Text } from "galio-framework";
import * as React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { ScrollView, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import LongSong from "../components/button/longSong";
import Footer from "../components/navigation/footer";
import { usePlayerContext } from "../contexts/playerContext";
import { useThemeContext } from "../contexts/themeContext";

export default function SearchScreen({ navigation, route }) {
  const theme = useThemeContext().theme;
  const moralis = useMoralis();
  const playerContext = usePlayerContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchResult = useMoralisQuery(
    "popexUpload",
    (q) =>
      q
        .startsWith(
          "title",
          searchTerm != "" ? searchTerm : "hfuecin83uc8294o3xnurioexw"
        )
        .limit(50),
    [searchTerm]
  );

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchResult.fetch();
    }, 1400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const getSongBySearch = () => {
    const Songs = moralis.Moralis.Object.extend("popexUpload");
    const query = new moralis.Moralis.Query();
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 60, marginBottom: 150 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={(e) => {
            navigation.goBack();
          }}
        >
          <Icon name="chevron-back" size={40} color={theme.colors.text}></Icon>
        </TouchableOpacity>
        <TextInput
          style={{
            width: "85%",
            borderWidth: 1,
            borderColor: theme.colors.disable,
            borderRadius: 10,
            color: theme.colors.text,
            fontSize: 20,
            paddingHorizontal: 15,
          }}
          onChangeText={(e) => setSearchTerm(e)}
        ></TextInput>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ minHeight: "120%", paddingTop: 10 }}
      >
        <Text p bold color={theme.colors.text}>
          SONG
        </Text>
        {searchTerm != "" && searchResult.data
          ? searchResult.data.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.attributes.uid}
                  onPress={(e) => {
                    playerContext.playPlaylist(searchResult.data, index);
                  }}
                >
                  <LongSong
                    songId={item.attributes.uid}
                    songName={item.attributes.title}
                    artistAddress={item.attributes.creator}
                    songImage={item.attributes.coverURI}
                  />
                </TouchableOpacity>
              );
            })
          : null}
        {/* <Text p bold color={theme.colors.text}>
          ARTIST
        </Text> */}
        <Footer />
      </ScrollView>
    </View>
  );
}
