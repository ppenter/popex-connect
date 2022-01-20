import { Button, Text } from "galio-framework";
import * as React from "react";
import { useMoralis } from "react-moralis";
import { TextInput, View } from "react-native";
import { Root } from "react-native-alert-notification";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from "react-native-shadow-cards";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "../contexts/themeContext";
import { useWalletConnect } from "../WalletConnect";

export default function ProfileScreen({ navigation }) {
  const [isNameEdit, setIsNameEdit] = React.useState(0);
  const [nameEdit, setNameEdit] = React.useState("");
  const colors = useThemeContext().theme.colors;
  const connector = useWalletConnect();
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
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text h3 bold color={colors.text}>
          Profile
        </Text>
        <Button
          style={{ width: "100%", padding: 0, margin: 0, marginTop: 20 }}
          onPress={async (e) => {
            e.preventDefault();
            await authenticate({ connector });
          }}
        >
          Connect with Metamask
        </Button>
      </View>
    );
  }

  return (
    <Root>
      <View style={{ paddingHorizontal: 20 }}>
        <Text h3 color={colors.text} style={{ marginTop: 0 }}>
          Profile
        </Text>
        <Card
          backgroundColor={colors.background}
          opacity={1}
          style={{ padding: 20, marginTop: 20 }}
        >
          <View style={{ alignItems: "center" }}>
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
              style={{ width: "100%", margin: 0, padding: 0 }}
              onPress={() => logout()}
            >
              Logout
            </Button>
          </View>
          {/* <Input placeholder="regular" /> */}
        </Card>
      </View>
    </Root>
  );
}