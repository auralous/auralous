import { GradientButton } from "@/components/Button";
import { RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import {
  Button,
  Heading,
  IconPlus,
  Size,
  Spacer,
  TextButton,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

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
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: Size[6],
  },
  srOnly: { height: 0, opacity: 0 },
});

const snapPoints = ["100%"];

const AddButtonModalContent = gestureHandlerRootHOC(
  function AddButtonModalContent({ onDismiss }) {
    const { t } = useTranslation();

    const navigation = useNavigation();

    const navigateTo = useCallback(
      (path: RouteName) => {
        navigation.navigate(path);
        onDismiss();
      },
      [navigation, onDismiss]
    );

    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", onDismiss);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onDismiss);
    }, [onDismiss]);

    return (
      <>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={6}
        />
        <View style={styles.newModal}>
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
          {/** For a11y */}
          <TextButton onPress={onDismiss} style={styles.srOnly}>
            {t("common.navigation.go_back")}
          </TextButton>
        </View>
      </>
    );
  } as FC<{
    onDismiss(): boolean;
  }>
);

const AddButton: FC = () => {
  const { t } = useTranslation();

  const ref = useRef<BottomSheetModal>(null);

  const onDismiss = useCallback(() => {
    ref.current?.dismiss();
    return true;
  }, []);

  const [{ data: dataMe }] = useMeQuery();
  const navigation = useNavigation();

  const onOpen = useCallback(() => {
    if (!dataMe) return navigation.navigate(RouteName.SignIn);
    ref.current?.present();
  }, [dataMe, navigation]);

  return (
    <>
      <GradientButton
        style={styles.button}
        onPress={onOpen}
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
      <BottomSheetModal
        backgroundComponent={null}
        handleComponent={null}
        ref={ref}
        snapPoints={snapPoints}
      >
        <AddButtonModalContent onDismiss={onDismiss} />
      </BottomSheetModal>
    </>
  );
};

export default AddButton;
