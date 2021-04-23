import { IconChevronLeft } from "@/assets/svg";
import { Button } from "@/components/Button";
import { Heading, Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    padding: Size[8],
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    marginBottom: Size[1],
  },
  buttonContainer: {
    marginTop: Size[8],
  },
});

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const colors = useColors();

  return (
    <View style={styles.root}>
      <Heading level={2} style={styles.heading}>
        {t("not_found.title")}
      </Heading>
      <Text align="center" color="textSecondary" size="lg">
        {t("not_found.description")}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          icon={
            <IconChevronLeft
              stroke={colors.controlText}
              width={24}
              height={24}
            />
          }
          onPress={() => navigation.goBack()}
        >
          {t("common.navigation.go_back")}
        </Button>
      </View>
    </View>
  );
};

export default NotFound;
