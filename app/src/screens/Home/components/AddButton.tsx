import { IconPlus } from "@/assets";
import { Button, GradientButton, TextButton } from "@/components/Button";
import { SlideModal, useDialog } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useMeQuery, useSessionCurrentLiveQuery } from "@auralous/api";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  button: {
    bottom: Size[4],
    elevation: 6,
    height: Size[14],
    position: "absolute",
    right: Size[4],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    width: Size[14],
  },
  choice: {
    flex: 1,
    height: 54,
    padding: Size[4],
  },
  choices: {
    flexDirection: "row",
  },
  newModal: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: Size[6],
  },
});

const AddButtonModalContent: FC<{
  onDismiss(): void;
}> = ({ onDismiss }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      onDismiss();
    },
    [navigation, onDismiss]
  );

  return (
    <>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" />
      <SafeAreaView style={styles.newModal}>
        <Heading level={2}>{t("new.title")}</Heading>
        <Spacer y={8} />
        <View style={styles.choices}>
          <Button
            variant="primary"
            onPress={() => navigateTo(RouteName.NewSelectSongs)}
            style={styles.choice}
          >
            {t("new.select_songs.title")}
          </Button>
          <Spacer x={3} />
          <GradientButton
            onPress={() => navigateTo(RouteName.NewQuickShare)}
            style={styles.choice}
          >
            {t("new.quick_share.title")}
          </GradientButton>
        </View>
        <Spacer y={6} />
        <TextButton onPress={onDismiss}>
          {t("common.navigation.go_back")}
        </TextButton>
      </SafeAreaView>
    </>
  );
};

const AddButton: FC = () => {
  const { t } = useTranslation();

  const [visible, present, dismiss] = useDialog();

  const [{ data: dataSessionCurrentLive }, refetchSessionCurrentLive] =
    useSessionCurrentLiveQuery({
      variables: { mine: true },
    });
  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(refetchSessionCurrentLive, [
    me?.user.id,
    refetchSessionCurrentLive,
  ]);

  const hasCurrentLiveSession =
    !!me && !!dataSessionCurrentLive?.sessionCurrentLive;

  if (hasCurrentLiveSession) return null;

  return (
    <>
      <GradientButton
        style={styles.button}
        onPress={present}
        accessibilityLabel={t("new.title")}
        icon={
          <IconPlus
            width={Size[6]}
            height={Size[6]}
            strokeWidth={3}
            stroke="#ffffff"
          />
        }
      />
      <SlideModal visible={visible} onDismiss={dismiss}>
        <AddButtonModalContent onDismiss={dismiss} />
      </SlideModal>
    </>
  );
};

export default AddButton;
