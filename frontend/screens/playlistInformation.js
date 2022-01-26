import { Text } from "galio-framework";
import * as React from "react";
import { useMoralisQuery } from "react-moralis";
import { ScrollView, View } from "react-native";
import LongPlaylist from "../components/button/longPlaylist";
import { useGlobalContext } from "../contexts/globalContext";
import { useThemeContext } from "../contexts/themeContext";

export default function PlaylistInformationScreen(props) {
  const theme = useThemeContext().theme;
  const [songArray, setSongArray] = React.useState([]);
  const global = useGlobalContext();
  if (!props.route.params.playlist) {
    return null;
  }
  const songInPlaylist = useMoralisQuery(
    "SongInPlaylist",
    (q) => q.equalTo("playlistId", props.route.params.playlist.id),
    [props.route.params.playlist, global.trigger]
  );
  const songList = useMoralisQuery(
    "popexUpload",
    (q) => q.containedIn("uid", songArray),
    [songArray]
  );

  React.useEffect(() => {
    let result = [];
    if (songInPlaylist.data.length > 0) {
      for (var i = 0; i < songInPlaylist.data.length; i++) {
        result[i] = songInPlaylist.data[i].attributes.songId;
      }
    }
    setSongArray(result);
  }, [songInPlaylist.data]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 20, marginBottom: 150 }}
    >
      <View style={{ wisth: "100%", alignItems: "center", marginTop: 60 }}>
        <Text h3 bold color={theme.colors.text} style={{ marginLeft: 10 }}>
          {props.route.params.playlist.attributes.name}
        </Text>
      </View>
      {songList.data
        ? songList.data.map((item, index) => {
            console.log();
            return (
              <LongPlaylist
                name={item.attributes.title}
                address={item.attributes.creator}
                songId={item.attributes.uid}
                image={item.attributes.coverURI}
                playlistId={props.route.params.playlist.id}
              />
            );
          })
        : null}
    </ScrollView>
  );
}
