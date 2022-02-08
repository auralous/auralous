import { IconSearch, IconX } from "@/assets";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    height: Size[10],
    justifyContent: "center",
    width: Size[10],
  },
  root: {
    paddingHorizontal: Size[8],
    paddingVertical: Size[2],
  },
});

const SearchInput: FC<{
  value: string;
  onSubmit(value: string): void;
}> = ({ onSubmit, value }) => {
  const ref = useRef<InputRef>(null);
  const onHandleSubmit = useCallback(() => {
    onSubmit((ref.current?.value || "").trim());
  }, [onSubmit]);
  const resetSearch = useCallback(() => {
    if (ref.current) ref.current.clear();
    onSubmit("");
  }, [onSubmit]);
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Input
        ref={ref}
        endIcon={
          value.trim().length > 0 ? (
            <TouchableOpacity style={styles.btn} onPress={resetSearch}>
              <IconX width={20} height={20} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={onHandleSubmit}>
              <IconSearch width={20} height={20} />
            </TouchableOpacity>
          )
        }
        onSubmit={onHandleSubmit}
        returnKeyType="search"
        placeholder={t("select_songs.search.placeholder")}
        accessibilityLabel={t("common.label.search")}
      />
    </View>
  );
};

export default SearchInput;
