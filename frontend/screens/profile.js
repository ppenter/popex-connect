import { Button, Text } from "galio-framework";
import * as React from "react";
import { useMoralis } from "react-moralis";
import { ScrollView, TextInput, View } from "react-native";
import { Root } from "react-native-alert-notification";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import SwitchThemeButton from "../components/button/switchThemeButton";
import { useGlobalContext } from "../contexts/globalContext";
import { useThemeContext } from "../contexts/themeContext";
import { useWalletConnect } from "../WalletConnect";

export default function ProfileScreen({ navigation }) {
  const [isNameEdit, setIsNameEdit] = React.useState(0);
  const [nameEdit, setNameEdit] = React.useState("");
  const global = useGlobalContext();
  const colors = useThemeContext().theme.colors;
  const connector = useWalletConnect();
  const themeContext = useThemeContext();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
    user,
    setUserData,
  } = useMoralis();

  const toggleEditName = () => {
    isNameEdit ? setIsNameEdit(0) : setIsNameEdit(1);
  };

  if (!isAuthenticated) {
    return (
      <View
        style={{ paddingHorizontal: 20, paddingTop: 60, marginBottom: 150 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon
            name="person-circle-outline"
            color={colors.primary}
            size={40}
          ></Icon>
          <Text h3 bold color={colors.text} style={{ marginLeft: 10 }}>
            Account
          </Text>
          <View style={{ position: "absolute", right: 0 }}>
            <SwitchThemeButton />
          </View>
        </View>
        <Button
          color={colors.primary}
          style={{ width: "100%", padding: 0, margin: 0, marginTop: 20 }}
          onPress={async (e) => {
            e.preventDefault();
            authenticate({ connector });
          }}
        >
          Connect with WalletConnect
        </Button>
      </View>
    );
  }

  return (
    <Root>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20 }}
      >
        <View style={{ flexDirection: "row", marginTop: 60 }}>
          <Icon
            name="person-circle-outline"
            color={colors.primary}
            size={40}
          ></Icon>
          <Text h3 bold color={colors.text} style={{ marginLeft: 10 }}>
            Account
          </Text>
          <View style={{ position: "absolute", right: 0 }}>
            <SwitchThemeButton />
          </View>
        </View>
        <View opacity={1} style={{ padding: 20, marginTop: 20 }}>
          <View
            style={{
              alignItems: "center",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {isNameEdit ? (
                <TextInput
                  placeholder={user.get("username")}
                  onChangeText={(e) => {
                    setNameEdit(e);
                  }}
                  onSubmitEditing={async (e) => {
                    toggleEditName();
                    setUserData({ username: nameEdit });
                  }}
                  style={{
                    fontSize: 32,
                    borderBottomWidth: 1,
                    borderColor: colors.text,
                    paddingHorizontal: 10,
                    width: "50%",
                    marginVertical: 15,
                    color: colors.text,
                  }}
                ></TextInput>
              ) : (
                <Text
                  bold
                  h4
                  color={colors.text}
                  style={{ maxWidth: "50%", marginVertical: 25 }}
                  numberOfLines={1}
                >
                  {user.get("username")}
                </Text>
              )}

              <TouchableOpacity
                onPress={(e) => {
                  toggleEditName();
                }}
                style={{ marginLeft: 10 }}
              >
                <Icon size={20} color={colors.text} name="pencil"></Icon>
              </TouchableOpacity>
            </View>
            <Text
              color={colors.text}
              numberOfLines={1}
              style={{ marginVertical: 10 }}
            >
              {user.get("ethAddress")}
            </Text>
            <Button
              color={colors.primary}
              style={{ width: "100%", margin: 0, padding: 0 }}
              onPress={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </Button>
          </View>
          {/* <Input placeholder="regular" /> */}
        </View>
      </ScrollView>
    </Root>
  );
}
