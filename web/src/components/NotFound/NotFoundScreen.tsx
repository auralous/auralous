import { NotFound } from "@auralous/ui";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useHistory } from "react-router";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

const NotFoundScreen: FC = () => {
  const history = useHistory();
  return (
    <View style={styles.root}>
      <NotFound onBack={history.goBack} />
    </View>
  );
};

export default NotFoundScreen;
