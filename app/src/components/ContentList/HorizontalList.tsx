/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-unused-styles */
import { IconChevronLeft, IconChevronRight } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { isTouchDevice } from "@/utils/utils";
import type { ReactElement } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  FlatListProps,
  LayoutChangeEvent,
  ListRenderItem,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from "react-native";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export interface HorizontalListProps<ItemT>
  extends Omit<FlatListProps<ItemT>, "renderItem" | "horizontal"> {
  renderItem(
    info: ListRenderItemInfo<ItemT> & { style: ViewStyle }
  ): ReactElement;
}

const styles = StyleSheet.create({
  arrowPressable: {
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: Size[10],
    zIndex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  list: {
    width: "100%",
  },
});

const isTouchDeviceValue = isTouchDevice();

const ItemSeparatorComponent = () => <Spacer x={3} />;

function HorizontalList<ItemT>({
  renderItem,
  style,
  ...props
}: HorizontalListProps<ItemT>) {
  const ref = useRef<FlatList>(null);

  const [width, setWidth] = useState(Dimensions.get("window").width);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const [listPos, setListPos] = useState<"start" | "mid" | "end">("start");

  const scrollOffsetRef = useRef(props.initialScrollIndex || 0);
  const contentSizeRef = useRef(0);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      if (scrollOffsetRef.current <= 0.5) {
        setListPos("start");
      } else if (
        scrollOffsetRef.current >=
        contentSizeRef.current - width - 0.5
      ) {
        setListPos("end");
      } else {
        setListPos("mid");
      }
    },
    [width]
  );
  const onContentSizeChange = useCallback((w: number) => {
    contentSizeRef.current = w;
  }, []);

  const itemStyle = useMemo(() => {
    if (width >= LayoutSize.lg) return { width: (1 / 6) * width - Size[4] };
    else if (width >= LayoutSize.md)
      return { width: (1 / 4) * width - Size[4] };
    else return { width: 0.4 * width - Size[4] };
  }, [width]);

  const renderItemsFL = useCallback<ListRenderItem<ItemT>>(
    (info) => {
      return renderItem({ ...info, style: itemStyle });
    },
    [renderItem, itemStyle]
  );

  return (
    <View style={style} onLayout={onLayout}>
      {!isTouchDeviceValue && (
        <>
          {listPos !== "start" && (
            <Pressable
              style={[styles.arrowPressable, { left: 0 }]}
              onPress={() =>
                ref.current?.scrollToOffset({
                  offset: scrollOffsetRef.current - width,
                  animated: true,
                })
              }
            >
              <LinearGradient
                colors={[Colors.background, "rgba(0,0,0,0)"]}
                style={styles.gradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <IconChevronLeft height={Size[8]} width={Size[8]} />
            </Pressable>
          )}
          {listPos !== "end" && (
            <Pressable
              style={[styles.arrowPressable, { right: 0 }]}
              onPress={() =>
                ref.current?.scrollToOffset({
                  offset: scrollOffsetRef.current + width,
                  animated: true,
                })
              }
            >
              <LinearGradient
                colors={[Colors.background, "rgba(0,0,0,0)"]}
                style={styles.gradient}
                start={{ x: 1, y: 0.5 }}
                end={{ x: 0, y: 0.5 }}
              />
              <IconChevronRight height={Size[8]} width={Size[8]} />
            </Pressable>
          )}
        </>
      )}
      <FlatList
        {...props}
        ref={ref}
        style={[styles.list, { minHeight: itemStyle.width }]}
        horizontal
        renderItem={renderItemsFL}
        ItemSeparatorComponent={ItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
      />
    </View>
  );
}

export default HorizontalList;
