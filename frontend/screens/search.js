import * as React from "react";
import { useMoralis } from "react-moralis";
import { ScrollView, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "../contexts/themeContext";

export default function SearchScreen({ navigation, route }) {
  const theme = useThemeContext().theme;
  const moralis = useMoralis();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm);
    }, 1400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const getSongBySearch = () => {
    const Songs = moralis.Moralis.Object.extend("popexUpload");
    const query = new moralis.Moralis.Query();
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 60 }}>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {searchResult
          ? searchResult.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    playerContext.playPlaylist(songByGenre.data, index);
                  }}
                >
                  <LongSong
                    songId={item.attributes.uid}
                    songName={item.attributes.title}
                    artistName={item.attributes.artist}
                    songImage={item.attributes.coverURI}
                  />
                </TouchableOpacity>
              );
            })
          : null}
      </ScrollView>
    </View>
  );
}
