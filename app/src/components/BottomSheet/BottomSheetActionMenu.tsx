import { BlurView } from "@/components/BlurView";
import { TextButton } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  handleIndicator: {
    backgroundColor: Colors.textSecondary,
  },
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

const backgroundComponent: FC<BottomSheetBackgroundProps> = ({ style }) => (
  <View style={style}>
    <BlurView blurType="dark" style={StyleSheet.absoluteFill} />
  </View>
);

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

  const { top } = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      handleStyle={{ marginTop: top }}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundComponent={backgroundComponent}
      snapPoints={snapPoints}
      stackBehavior="push"
      onDismiss={onDismiss}
    >
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
                onPress={() => {
                  item.onPress?.();
                  onDismiss();
                }}
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
    </BottomSheetModal>
  );
};

export default BottomSheetActionMenu;
