import { Music, PlayListAdd } from "assets/svg";
import { Header } from "components/Header";
import { Spacer } from "components/Spacer";
import { Text } from "components/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { ColorValue, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "styles";

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  choice: {
    width: Size[32],
    height: Size[32],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
});

interface ChoiceProps {
  title: string;
  icon: React.ReactNode;
  backgroundColor: ColorValue;
  onPress(): void;
}

const Choice: React.FC<ChoiceProps> = ({
  title,
  backgroundColor,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.choice, { backgroundColor }]}>
        {icon}
        <Spacer y={1} />
        <Text bold style={{ color: "#ffffff" }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ModeSelector: React.FC<{
  setMode(mode: "select" | "quick"): void;
}> = ({ setMode }) => {
  const { t } = useTranslation();
  return (
    <>
      <Header title={t("new.title")} />
      <View style={styles.root}>
        <Choice
          backgroundColor="#EB367F"
          title={t("new.select_songs.title")}
          icon={<PlayListAdd width={Size[10]} height={Size[10]} />}
          onPress={() => setMode("select")}
        />
        <Spacer y={4} />
        <Choice
          backgroundColor="#4C2889"
          title={t("new.quick_share.title")}
          icon={<Music stroke="white" width={Size[8]} height={Size[8]} />}
          onPress={() => setMode("select")}
        />
      </View>
    </>
  );
};

export default ModeSelector;
