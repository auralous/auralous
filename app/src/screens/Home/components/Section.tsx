import { Heading, Size, Spacer, Text } from "@auralous/ui";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

interface SectionProps {
  title: string;
  description?: string;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[2],
  },
  root: {
    marginBottom: Size[6],
  },
});

const Section: FC<SectionProps> = ({ title, description, children }) => {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Heading level={6}>{title}</Heading>
          <Spacer y={3} />
          {!!description && <Text color="textSecondary">{description}</Text>}
        </View>
        <View></View>
      </View>
      <Spacer y={2} />
      <View>{children}</View>
    </View>
  );
};

export default Section;
