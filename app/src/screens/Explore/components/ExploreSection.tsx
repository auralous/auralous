import { Spacer } from "@/components/Spacer";
import { Heading, RNLink, Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface SectionProps {
  title: string;
  description?: string | null;
  href?: string;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[2],
  },
  root: {
    marginBottom: Size[10],
  },
  seeAll: {
    textTransform: "capitalize",
  },
});

const ExploreSection: FC<SectionProps> = ({
  title,
  description,
  children,
  href,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Heading level={6}>{title}</Heading>
          {!!description && (
            <>
              <Spacer y={4} />
              <Text color="textSecondary">{description}</Text>
            </>
          )}
        </View>
        <View>
          {href && (
            <RNLink to={href}>
              <Text color="primary" style={styles.seeAll}>
                {t("common.navigation.see_all")}
              </Text>
            </RNLink>
          )}
        </View>
      </View>
      <Spacer y={4} />
      <View>{children}</View>
    </View>
  );
};

export default ExploreSection;
