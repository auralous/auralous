import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { LoadingBlock } from "components/Loading";
import { Heading } from "components/Typography";
import { Maybe } from "gql/gql.gen";
import React, { useCallback, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Size, useColors } from "styles";
import useStoreBottomSheet from "./store";

interface ListProps<Item = any> {
  renderItem: ListRenderItem<Item>;
  keyExtractor: (item: Item, index: number) => string;
  data: Maybe<Item[]> | undefined;
  visible: boolean;
  fetching: boolean;
  username: string;
  listName: string;
  onRefresh(): void;
}

const styles = StyleSheet.create({
  root: {
    borderTopLeftRadius: Size[4],
    borderTopRightRadius: Size[4],
    overflow: "hidden",
    paddingHorizontal: Size[4],
  },
  heading: { marginBottom: Size[3] },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  flatList: { flex: 1 },
});

const snapPoints = [0, "100%"];

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => {
  const colors = useColors();
  return (
    <View style={[style, { backgroundColor: colors.backgroundSecondary }]} />
  );
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
  }));

  const colors = useColors();

  return (
    <Animated.View
      style={[
        style,
        { backgroundColor: colors.background, zIndex: -1 },
        containerAnimatedStyle,
      ]}
    />
  );
};

const List: React.FC<ListProps> = ({
  renderItem,
  keyExtractor,
  data,
  visible,
  username,
  listName,
  fetching,
}) => {
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheet>(null);

  const close = useStoreBottomSheet((state) => state.close);

  const handleSheetChange = useCallback(
    (index: number) => index === 0 && close(),
    [close]
  );

  useEffect(() => {
    sheetRef.current?.snapTo(visible ? 1 : 0);
  }, [visible]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      backgroundComponent={CustomBackground}
      backdropComponent={CustomBackdrop}
      style={styles.root}
    >
      <Heading level={4} color="textSecondary" style={styles.heading}>
        <Trans
          i18nKey="user.of_user"
          values={{ name: t(`user.${listName}`), username }}
          t={t}
          components={[
            <Heading
              level={4}
              key="name"
              style={{ textTransform: "lowercase" }}
            />,
          ]}
        />
      </Heading>
      {fetching && !data ? (
        <View style={styles.loading}>
          <LoadingBlock />
        </View>
      ) : (
        <BottomSheetFlatList
          data={data || []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: Size[2],
          }}
          style={styles.flatList}
        />
      )}
    </BottomSheet>
  );
};

export default List;
