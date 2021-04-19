import { useNavigation } from "@react-navigation/core";
import { Avatar } from "components/Avatar";
import { Button } from "components/Button";
import { Heading } from "components/Typography";
import { useMe } from "gql/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const header = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

const Header: React.FC = () => {
  const { t } = useTranslation();
  const me = useMe();
  const navigation = useNavigation();

  return (
    <View style={header.root}>
      <Heading level={2}>{t("home.title")}</Heading>
      {me ? (
        <View>
          <Avatar
            size={12}
            href={me.user.profilePicture}
            username={me.user.username}
          />
        </View>
      ) : (
        <View>
          <Button onPress={() => navigation.navigate("sign-in")}>
            {t("sign_in.title")}
          </Button>
        </View>
      )}
    </View>
  );
};

export default Header;
