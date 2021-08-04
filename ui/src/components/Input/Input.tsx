import { makeStyles, Size, useColors } from "@/styles";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ColorValue,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputSubmitEditingEventData,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface InputProps {
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  defaultValue?: string;
  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions;
  accessibilityLabel?: string;
  onSubmit?: (text: string) => void;
}

const useStyles = makeStyles((theme) => ({
  input: {
    flex: 1,
    padding: 0,
    color: theme.colors.text,
  },
}));

export interface InputRef {
  isFocused(): boolean;
  clear(): void;
  blur(): void;
  focus(): void;
  value: string;
  setValue(value: string): void;
}

const Input = forwardRef<InputRef, InputProps>(function Input(
  {
    startIcon,
    endIcon,
    defaultValue = "",
    placeholder,
    returnKeyType,
    accessibilityLabel,
    onSubmit,
  },
  ref
) {
  const internalRef = useRef<TextInput>(null);
  const dstyles = useStyles();
  const colors = useColors();

  const [value, setValue] = useState<string>(defaultValue);

  const isFocused = useSharedValue(false);

  const onFocused = useCallback(() => (isFocused.value = true), [isFocused]);
  const onBlur = useCallback(() => (isFocused.value = false), [isFocused]);

  const stylesRoot = useAnimatedStyle<ViewStyle>(
    () => ({
      borderRadius: 9999,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      paddingHorizontal: Size[4],
      paddingVertical: Size[2],
      borderColor: withTiming(
        isFocused.value ? colors.control : colors.controlDark
      ) as unknown as ColorValue,
    }),
    [colors]
  );

  const onSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmit?.(e.nativeEvent.text);
    },
    [onSubmit]
  );

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        return internalRef.current?.focus();
      },
      blur() {
        return internalRef.current?.blur();
      },
      clear() {
        return internalRef.current?.clear();
      },
      isFocused() {
        return internalRef.current?.isFocused() || false;
      },
      setValue,
      value,
    }),
    [value]
  );

  return (
    <Animated.View style={stylesRoot}>
      {startIcon}
      <TextInput
        ref={internalRef}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.textTertiary}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={dstyles.input}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocused}
        onBlur={onBlur}
        underlineColorAndroid="rgba(0,0,0,0)"
      />
      {endIcon}
    </Animated.View>
  );
});

export default Input;
