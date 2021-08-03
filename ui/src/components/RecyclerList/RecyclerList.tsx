import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Dimensions,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
  RecyclerListViewProps,
} from "recyclerlistview";

export interface RecyclerRenderItemInfo<ItemT> {
  item: ItemT;
  index: number;
}

export type RecyclerRenderItem<ItemT> = (
  info: RecyclerRenderItemInfo<ItemT>
) => JSX.Element | JSX.Element[] | null;

export interface RecyclerListProps<ItemT> {
  data: ItemT[];
  height: number;
  onEndReached?(): void;
  renderItem: RecyclerRenderItem<ItemT>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentHorizontalPadding?: number;
  ListEmptyComponent?: ReactNode | null;
  _ref?: RefObject<RecyclerListView<any, any>> | null;
  scrollViewProps?: ScrollViewProps;
  onScroll?: RecyclerListViewProps["onScroll"];
  externalScrollView?: RecyclerListViewProps["externalScrollView"];
  extendedState?: RecyclerListViewProps["extendedState"];
}

const layoutType = "@@Layout";

const getLayoutTypeForIndex = () => layoutType;

const initialState = () =>
  new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

const initialWidth = () => Dimensions.get("window").width;

const styles = StyleSheet.create({
  default: { flex: 1 },
});

export default function RecyclerList<ItemT>({
  height,
  onEndReached,
  renderItem,
  data,
  style,
  contentContainerStyle,
  contentHorizontalPadding = 0,
  ListEmptyComponent,
  _ref,
  scrollViewProps: extraScrollViewProps,
  onScroll,
  externalScrollView,
  extendedState,
}: RecyclerListProps<ItemT>) {
  const [width, setWidth] = useState(initialWidth);

  const [dataProvider, setDataProvider] = useState(initialState);
  useEffect(() => {
    setDataProvider((prevDataProvider) => prevDataProvider.cloneWithRows(data));
  }, [data]);

  const layoutProvider = useMemo(() => {
    const itemWidth = width - contentHorizontalPadding * 2;
    return new LayoutProvider(getLayoutTypeForIndex, (type, dim) => {
      dim.height = height;
      dim.width = itemWidth;
    });
  }, [width, height, contentHorizontalPadding]);
  const rowRenderer = useCallback(
    (type: string | number, item: ItemT, index: number) => {
      return renderItem({ item, index });
    },
    [renderItem]
  );

  const scrollViewProps = useMemo<ScrollViewProps>(
    () => ({
      onContentSizeChange: (width, height) => {
        setWidth(width);
        extraScrollViewProps?.onContentSizeChange?.(width, height);
      },
      ...extraScrollViewProps,
    }),
    [extraScrollViewProps]
  );

  if (data.length === 0)
    return <View style={style || styles.default}>{ListEmptyComponent}</View>;

  return (
    <RecyclerListView
      ref={_ref}
      style={style || styles.default}
      contentContainerStyle={contentContainerStyle}
      onEndReached={onEndReached}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={rowRenderer}
      scrollViewProps={scrollViewProps}
      onScroll={onScroll}
      externalScrollView={externalScrollView}
      extendedState={extendedState}
    />
  );
}
