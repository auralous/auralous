import { Button } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDerivedValue } from "react-native-reanimated";

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
  bs: {
    marginHorizontal: Size[4],
  },
  bsBackground: {
    backgroundColor: Colors.backgroundSecondary,
  },
  bsLand: {
    marginHorizontal: "auto",
    maxWidth: LayoutSize.md - Size[8],
  },
  cancel: {
    height: Size[10],
  },
  handleIndicator: {
    backgroundColor: Colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    height: Size[12],
    marginBottom: Size[2],
  },
  headerMeta: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: Size[12],
    width: Size[12],
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[12],
    marginBottom: Size[2],
  },
  root: {
    flex: 1,
    padding: Size[4],
  },
});

const BackdropComponent: FC<BottomSheetBackdropProps> = (props) => {
  const animatedIndex = useDerivedValue(
    () => props.animatedIndex.value + 1,
    []
  );
  return <BottomSheetBackdrop {...props} animatedIndex={animatedIndex} />;
};
const handleComponent = () => null;

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

  const snapPoints = useMemo(
    () => [
      (Size[12] + Size[2]) * items.length +
        Size[14] + // header
        Size[10] + // cancel button
        Size[4] * 2, // padding * 2
    ],
    [items.length]
  );

  const isLandscape = useWindowDimensions().width > LayoutSize.md;

  return (
    <BottomSheetModal
      ref={ref}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bsBackground}
      backdropComponent={BackdropComponent}
      handleHeight={0}
      handleComponent={handleComponent}
      snapPoints={snapPoints}
      stackBehavior="push"
      onDismiss={onDismiss}
      style={isLandscape ? styles.bsLand : styles.bs}
      detached
      bottomInset={Size[4]}
    >
      <View style={styles.root}>
        <View style={styles.header}>
          {image && (
            <>
              <Image source={{ uri: image }} style={styles.image} />
              <Spacer x={4} />
            </>
          )}
          <View style={styles.headerMeta}>
            <Text bold numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <>
                <Spacer y={2} />
                <Text color="textSecondary">{subtitle}</Text>
              </>
            )}
          </View>
        </View>
        {items.map((item) => (
          <TouchableOpacity
            style={styles.item}
            key={item.text}
            onPress={() => {
              onDismiss();
              item.onPress?.();
            }}
          >
            {item.icon}
            <Spacer x={3} />
            <Text fontWeight="medium" size="lg">
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
        <Button variant="text" style={styles.cancel} onPress={onDismiss}>
          {t("common.action.cancel")}
        </Button>
      </View>
    </BottomSheetModal>
  );
};

export default BottomSheetActionMenu;
