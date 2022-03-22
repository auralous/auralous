import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputProps,
  TextInputSubmitEditingEventData,
  ViewStyle,
} from "react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

interface InputProps
  extends Pick<
    TextInputProps,
    "blurOnSubmit" | "autoFocus" | "returnKeyType" | "placeholder"
  > {
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  defaultValue?: string;
  accessibilityLabel?: string;
  onSubmit?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  variant?: "underline";
}

const styles = StyleSheet.create({
  input: {
    color: Colors.text,
    flex: 1,
    paddingHorizontal: Size[4],
    paddingVertical: 0,
  },
  root: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    height: Size[10],
  },
  rootDefault: {
    borderRadius: Size[1],
  },
  rootUnderline: {
    backgroundColor: "transparent",
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1.5,
  },
});

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
    style,
    variant,
    blurOnSubmit,
    autoFocus,
  },
  ref
) {
  const internalRef = useRef<TextInput>(null);

  const [value, setValue] = useState<string>(defaultValue);

  const isFocused = useSharedValue(false);

  const onFocused = useCallback(() => (isFocused.value = true), [isFocused]);
  const onBlur = useCallback(() => (isFocused.value = false), [isFocused]);

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
        return setValue("");
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
    <View
      style={[
        StyleSheet.compose(styles.root as ViewStyle, style),
        variant === "underline" ? styles.rootUnderline : styles.rootDefault,
      ]}
    >
      {startIcon}
      <TextInput
        autoFocus={autoFocus}
        ref={internalRef}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={Colors.textTertiary}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={styles.input}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocused}
        onBlur={onBlur}
        underlineColorAndroid="rgba(0,0,0,0)"
        blurOnSubmit={blurOnSubmit}
      />
      {endIcon}
    </View>
  );
});

export default Input;
