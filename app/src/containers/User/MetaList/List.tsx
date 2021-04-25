import {
  BottomSheetCustomBackdrop,
  BottomSheetCustomBackground,
} from "@/components/BottomSheet";
import { LoadingBlock } from "@/components/Loading";
import { Heading } from "@/components/Typography";
import { Maybe } from "@/gql/gql.gen";
import { Size } from "@/styles";
import { commonStyles } from "@/styles/common";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ListRenderItem, StyleSheet, View } from "react-native";
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
  flatList: { flex: 1 },
});

const snapPoints = [0, "100%"];

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
      backgroundComponent={BottomSheetCustomBackground}
      backdropComponent={BottomSheetCustomBackdrop}
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
        <View style={commonStyles.fillAndCentered}>
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
