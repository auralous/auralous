import { NotFound } from "@/components/Page";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
