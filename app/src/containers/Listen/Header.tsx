import { Avatar } from "components/Avatar";
import { Button } from "components/Button";
import { Heading } from "components/Typography";
import { useMe } from "gql/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "utils/i18n";

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
  return (
    <View style={header.root}>
      <Heading level={2}>{t("listen.title")}</Heading>
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
          <Button>{t("sign_in.title")}</Button>
        </View>
      )}
    </View>
  );
};

export default Header;
