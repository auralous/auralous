import { IconChevronLeft } from "@/assets";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: Size[8],
  },
  heading: {
    marginBottom: Size[1],
  },
  root: {
    alignItems: "center",
    justifyContent: "center",
    padding: Size[8],
  },
});

const NotFound: FC<{ onBack(): void }> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Heading level={2} style={styles.heading}>
        {t("not_found.title")}
      </Heading>
      <Spacer y={2} />
      <Text align="center" color="textSecondary" size="lg">
        {t("not_found.description")}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          icon={<IconChevronLeft width={24} height={24} />}
          onPress={onBack}
        >
          {t("common.navigation.go_back")}
        </Button>
      </View>
    </View>
  );
};

export default NotFound;
