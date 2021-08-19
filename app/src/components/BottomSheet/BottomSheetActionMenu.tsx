import { Size, Spacer, Text, TextButton } from "@auralous/ui";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import { FC, ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackHandlerDismiss } from "./useBackHandlerDismiss";

export interface BottomSheetActionMenuProps {
  visible: boolean;
  onDismiss(): void;
  image?: string;
  title: string;
  subtitle?: string;
  items: BottomSheetActionMenuItem[];
}

export interface BottomSheetActionMenuItem {
  icon: ReactNode;
  text: string;
  onPress?(): void;
}

const styles = StyleSheet.create({
  cancel: {
    height: Size[16],
  },
  content: { flex: 1, paddingHorizontal: Size[4], paddingTop: Size[16] },
  ghRoot: { flex: 1 },
  header: {
    flexDirection: "row",
  },
  headerMeta: {
    justifyContent: "center",
  },
  image: {
    height: Size[16],
    width: Size[16],
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[12],
    marginBottom: Size[2],
  },
});

const snapPoints = ["100%"];

const BottomSheetActionMenu: FC<BottomSheetActionMenuProps> = ({
  visible,
  onDismiss,
  title,
  subtitle,
  items,
  image,
}) => {
  const { t } = useTranslation();

  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  useBackHandlerDismiss(visible, onDismiss);

  return (
    <BottomSheetModal
      ref={ref}
      handleComponent={null}
      backgroundComponent={null}
      snapPoints={snapPoints}
      stackBehavior="push"
      enableContentPanningGesture={false}
    >
      <GestureHandlerRootView style={styles.ghRoot}>
        <BlurView blurType="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.content}>
          <BottomSheetScrollView>
            <View style={styles.header}>
              {image && (
                <>
                  <Image source={{ uri: image }} style={styles.image} />
                  <Spacer x={4} />
                </>
              )}
              <View style={styles.headerMeta}>
                <Text bold>{title}</Text>
                {subtitle && (
                  <>
                    <Spacer y={2} />
                    <Text color="textSecondary">{subtitle}</Text>
                  </>
                )}
              </View>
            </View>
            <Spacer y={6} />
            <View>
              {items.map((item) => (
                <TouchableOpacity
                  style={styles.item}
                  key={item.text}
                  onPress={item.onPress}
                >
                  {item.icon}
                  <Spacer x={3} />
                  <Text bold="medium" size="lg">
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetScrollView>
        </SafeAreaView>
        <TextButton style={styles.cancel} onPress={onDismiss}>
          {t("common.action.cancel")}
        </TextButton>
      </GestureHandlerRootView>
    </BottomSheetModal>
  );
};

export default BottomSheetActionMenu;
