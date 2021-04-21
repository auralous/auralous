import { useNavigation } from "@react-navigation/core";
import { useLinkTo } from "@react-navigation/native";
import { Avatar } from "components/Avatar";
import { Button } from "components/Button";
import { Heading } from "components/Typography";
import { useMe } from "gql/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const Header: React.FC = () => {
  const { t } = useTranslation();
  const me = useMe();
  const navigation = useNavigation();
  const linkTo = useLinkTo();

  return (
    <View style={styles.root}>
      <Heading level={2}>{t("home.title")}</Heading>
      <View style={styles.right}>
        {me ? (
          <>
            <Pressable onPress={() => linkTo(`/user/${me.user.username}`)}>
              <Avatar
                size={12}
                href={me.user.profilePicture}
                username={me.user.username}
              />
            </Pressable>
          </>
        ) : (
          <>
            <Button onPress={() => navigation.navigate("sign-in")}>
              {t("sign_in.title")}
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default Header;
