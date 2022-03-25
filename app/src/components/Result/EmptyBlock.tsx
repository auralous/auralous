import { IconMusicX } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const EmptyBlock: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <IconMusicX color={Colors.textSecondary} />
      <Spacer y={2} />
      <Text color="textSecondary">{t("common.result.empty")}</Text>
    </>
  );
};

export default EmptyBlock;
