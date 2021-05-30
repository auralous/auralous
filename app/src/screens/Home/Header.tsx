import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import { useMe } from "@/gql/hooks";
import { Size } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { RouteName } from "../types";
import AddButton from "./AddButton";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Size[6],
    paddingVertical: Size[1],
    marginBottom: Size[4],
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

  return (
    <View style={styles.root}>
      <Heading level={2}>{t("home.title")}</Heading>
      <View style={styles.right}>
        {me ? (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate(RouteName.User, {
                  username: me.user.username,
                })
              }
            >
              <Avatar
                size={12}
                href={me.user.profilePicture}
                username={me.user.username}
              />
            </Pressable>
            <Spacer x={2} />
            <AddButton />
          </>
        ) : (
          <>
            <Button onPress={() => navigation.navigate(RouteName.SignIn)}>
              {t("sign_in.title")}
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default Header;
