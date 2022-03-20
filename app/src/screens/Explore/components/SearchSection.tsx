import { IconSearch } from "@/assets";
import { Button } from "@/components/Button";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { RouteName } from "@/screens/types";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const SearchSection: FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const ref = useRef<InputRef>(null);
  const onSubmit = useCallback(() => {
    const query = ref.current?.value.trim();
    if (!query) return;
    navigation.navigate(RouteName.Search, { query });
  }, [navigation]);

  return (
    <View>
      <Input
        onSubmit={onSubmit}
        ref={ref}
        placeholder={t("search.placeholder")}
        endIcon={
          <Button
            accessibilityLabel={t("search.title")}
            icon={<IconSearch />}
            onPress={onSubmit}
            variant="text"
          />
        }
      />
    </View>
  );
};

export default SearchSection;
