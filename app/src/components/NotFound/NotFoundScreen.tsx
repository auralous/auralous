import { NotFound } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const NotFoundScreen: FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <NotFound onBack={navigation.goBack} />
    </View>
  );
};

export default NotFoundScreen;
