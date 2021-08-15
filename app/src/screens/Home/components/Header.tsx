import { RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import { Avatar, Button, Heading, Size } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  right: {
    alignItems: "center",
    flexDirection: "row",
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[4],
    paddingHorizontal: Size[6],
    paddingVertical: Size[1],
  },
});

const Header: FC = () => {
  const { t } = useTranslation();
  const [{ data: { me } = { me: undefined } }] = useMeQuery();

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
