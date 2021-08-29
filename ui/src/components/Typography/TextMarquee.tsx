import { Size } from "@/styles";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextLayoutEventData,
  ViewStyle,
} from "react-native";
import { StyleSheet, Text as RNText } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { TextProps } from "./Typography";
import { useStyle } from "./Typography";

const spacerWidth = Size[10];

const styles = StyleSheet.create({
  clone: {
    paddingLeft: spacerWidth,
  },
  content: {
    // workaround for text cut off
    paddingBottom: 8,
  },
  root: {
    marginBottom: -8,
  },
});

export const TextMarquee: FC<
  Omit<TextProps, "numberOfLines"> & {
    containerStyle?: StyleProp<ViewStyle>;
    duration: number;
    marqueeDelay?: number;
  }
> = ({ children, duration, marqueeDelay = 0, containerStyle, ...props }) => {
  const style = useStyle(props);
  const [containerWidth, setContainerWidth] = useState(0);
  const [childWidth, setChildWidth] = useState(0);

  const onLayoutContainer = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const onTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      setChildWidth(event.nativeEvent.lines[0].width);
    },
    []
  );

  const aref = useAnimatedRef<Animated.ScrollView>();

  const isOverflow = childWidth > containerWidth;
  const scrollableLength = childWidth + spacerWidth;

  const scrollValue = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(aref, scrollValue.value, 0, false);
  }, []);

  useEffect(() => {
    if (!isOverflow) return;
    scrollValue.value = withRepeat(
      withSequence(
        withTiming(scrollableLength, {
          duration: duration,
        }),
        withDelay(marqueeDelay, withTiming(0, { duration: 0 }))
      ),
      -1
    );
    return () => {
      scrollValue.value = 0;
    };
  }, [scrollableLength, marqueeDelay, duration, scrollValue, isOverflow]);

  return (
    <Animated.ScrollView
      ref={aref}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      horizontal
      style={[styles.root, containerStyle]}
      contentContainerStyle={styles.content}
      onLayout={onLayoutContainer}
    >
      <RNText onTextLayout={onTextLayout} style={[style, props.style]}>
        {children}
      </RNText>
      {isOverflow && (
        <RNText
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
          style={[style, props.style, styles.clone]}
        >
          {children}
        </RNText>
      )}
    </Animated.ScrollView>
  );
};
