import { IconSearch, IconX } from "@/assets";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Size } from "@/styles";
import type { FC } from "react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
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
            <TouchableOpacity onPress={resetSearch}>
              <IconX width={20} height={20} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onHandleSubmit}>
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
