import { RouteName } from "@/screens/types";
import { Colors, Heading, Size, Text, TextButton } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: Size[6],
    padding: Size[2],
  },
  text: {
    marginBottom: Size[4],
  },
});

const MapNavigate: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onPress = useCallback(
    () => navigation.navigate(RouteName.Map),
    [navigation]
  );

  return (
    <View style={styles.root}>
      <Heading level={4} align="center">
        {t("map.title_branded")}
      </Heading>
      <Text style={styles.text} align="center">
        {t("map.description")}
      </Text>
      <TextButton onPress={onPress}>{t("map.open_map")}</TextButton>
    </View>
  );
};

export default MapNavigate;
