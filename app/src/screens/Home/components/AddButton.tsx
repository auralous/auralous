import { IconPlus } from "@/assets";
import { Button, GradientButton } from "@/components/Button";
import { useBackHandlerDismiss, useDialog } from "@/components/Dialog";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useMeQuery, useSessionCurrentLiveQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,.8)",
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
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
    zIndex: 1,
  },
  buttonAdd: {
    width: Size[14],
  },
  buttonQuickShare: {
    transform: [
      {
        translateY: -Size[16],
      },
    ],
  },
  buttonSelectSongs: {
    transform: [
      {
        translateY: -Size[32],
      },
    ],
  },
});

const AddOverlay: FC<{ dismiss(): void }> = ({ dismiss }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      dismiss();
    },
    [navigation, dismiss]
  );

  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withTiming(1);
  }, [animValue]);

  const backdropStyle = useAnimatedStyle(
    () => ({ opacity: animValue.value }),
    []
  );

  useBackHandlerDismiss(true, dismiss);

  return (
    <>
      <AnimatedPressable
        style={[styles.backdrop, backdropStyle]}
        onPress={dismiss}
      />
      <Button
        style={[styles.button, styles.buttonSelectSongs]}
        onPress={() => navigateTo(RouteName.NewSelectSongs)}
      >
        {t("new.select_songs.title")}
      </Button>
      <Button
        style={[styles.button, styles.buttonQuickShare]}
        onPress={() => navigateTo(RouteName.NewQuickShare)}
      >
        {t("new.quick_share.title")}
      </Button>
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
      {visible && <AddOverlay dismiss={dismiss} />}
      <GradientButton
        style={[styles.button, styles.buttonAdd]}
        onPress={visible ? dismiss : present}
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
    </>
  );
};

export default AddButton;
