import { IconChevronLeft } from "@/assets/svg";
import { useColors } from "@/styles";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "../Typography";
import HeaderBase from "./HeaderBase";

interface HeaderProps {
  title: string;
  translucent?: boolean;
  backText?: string;
}

const Header: React.FC<HeaderProps> = ({ title, backText, translucent }) => {
  const navigation = useNavigation();
  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <HeaderBase
      title={title}
      translucent={translucent}
      left={
        <>
          <IconChevronLeft stroke={colors.text} height={27} width={27} />
          {backText && <Text bold>{backText}</Text>}
        </>
      }
      leftLabel={t("common.navigation.go_back")}
      onLeftPress={goBack}
    />
  );
};

export default Header;
