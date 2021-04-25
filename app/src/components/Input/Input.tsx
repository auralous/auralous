import { Size, useColors } from "@/styles";
import React, { useCallback, useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface InputProps<TFieldValues> {
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  name: string;
  control?: Control<TFieldValues>;
  defaultValue?: string;
  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions;
  accessibilityLabel?: string;
  onSubmit?: () => void;
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 9999,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: Size[2],
  },
  input: {
    flex: 1,
    padding: 0,
    height: "100%",
  },
});

const Input: React.FC<InputProps<any>> = ({
  startIcon,
  endIcon,
  name,
  control,
  defaultValue = "",
  placeholder,
  returnKeyType,
  accessibilityLabel,
  onSubmit,
}) => {
  const colors = useColors();
  const { field } = useController({
    control,
    defaultValue,
    name,
  });
  const [isFocused, setIsFocused] = useState(false);
  const onFocused = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: isFocused ? colors.inputFocused : colors.input },
      ]}
    >
      {startIcon}
      <TextInput
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.textTertiary}
        placeholder={placeholder}
        value={field.value}
        onChangeText={field.onChange}
        style={[styles.input, { color: colors.inputText }]}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmit}
        onFocus={onFocused}
        onBlur={onBlur}
      />
      {endIcon}
    </View>
  );
};

export default Input;
