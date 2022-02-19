import { IconChevronDown } from "@/assets";
import { Button } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/Loading";
import { NullComponent } from "@/components/misc";
import { Spacer } from "@/components/Spacer";
import { Toaster } from "@/components/Toast";
import { Text } from "@/components/Typography";
import { useCurrentContextMeta } from "@/player";
import { RouteName } from "@/screens/types";
import { LayoutSize, Size } from "@/styles/spacing";
import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayerBar from "./PlayerBar";
import PlayerViewBackground from "./PlayerViewBackground";

const PlayerViewContent = lazy(() => import("./PlayerViewContent"));
const PlayerViewContentLand = lazy(() => import("./PlayerViewContent.land"));

const styles = StyleSheet.create({
  headerTitle: {
    paddingVertical: Size[1],
  },
  playingFromText: {
    textTransform: "uppercase",
  },
  root: {
    height: "100%",
    paddingTop: Size[2],
    width: "100%",
  },
});

const PlayerViewHeader: FC<{ onDismiss(): void }> = ({ onDismiss }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const contextMeta = useCurrentContextMeta();

  const onHeaderTitlePress = useCallback(() => {
    if (!contextMeta) return;
    if (contextMeta.type === "session") {
      navigation.navigate(RouteName.Session, { id: contextMeta.id });
    } else if (contextMeta.type === "playlist") {
      navigation.navigate(RouteName.Playlist, { id: contextMeta.id });
    }
  }, [contextMeta, navigation]);

  return (
    <>
      <Header
        title={
          contextMeta ? (
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={onHeaderTitlePress}
            >
              <Text size="xs" style={styles.playingFromText} align="center">
                {t("player.playing_from", { entity: contextMeta.type })}
              </Text>
              <Spacer y={2} />
              <Text size="sm" bold align="center">
                {contextMeta.contextDescription}
              </Text>
            </TouchableOpacity>
          ) : (
            ""
          )
        }
        left={
          <Button
            variant="text"
            onPress={onDismiss}
            icon={<IconChevronDown />}
            accessibilityLabel={t("common.navigation.go_back")}
          />
        }
      />
    </>
  );
};

const snapPoints = ["100%"];
const BackgroundComponent: FC<BottomSheetBackgroundProps> = ({
  style,
  pointerEvents,
}) => <PlayerViewBackground style={style} pointerEvents={pointerEvents} />;

const PlayerView: FC = () => {
  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [index, setIndex] = useState(-1);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const present = useCallback(() => {
    bottomSheetRef.current?.present();
    setIndex(0);
  }, []);

  const onDismiss = useCallback(() => setIndex(-1), []);

  useEffect(() => {
    if (index === -1) return;
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss, index]);

  useBackHandlerDismiss(index === 0, dismiss);

  const { width: windowWidth } = useWindowDimensions();

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        handleComponent={NullComponent}
        backgroundComponent={BackgroundComponent}
        snapPoints={snapPoints}
        stackBehavior="push"
        enableContentPanningGesture={false}
        onDismiss={onDismiss}
      >
        <SafeAreaView style={styles.root}>
          <PlayerViewHeader onDismiss={dismiss} />
          <Suspense fallback={<LoadingScreen />}>
            {windowWidth >= LayoutSize.lg ? (
              <PlayerViewContentLand />
            ) : (
              <PlayerViewContent />
            )}
          </Suspense>
        </SafeAreaView>
        <Toaster />
      </BottomSheetModal>
      <PlayerBar onPress={present} />
    </>
  );
};

export default PlayerView;
