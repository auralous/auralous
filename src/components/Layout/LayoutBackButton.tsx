import { SvgChevronDown } from "assets/svg";
import { Button } from "components/Pressable";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import { useContext } from "react";
import LayoutContext from "./LayoutContext";

const LayoutBackButton: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { prevPathname } = useContext(LayoutContext);
  const onPress = () => {
    if (prevPathname.current) router.back();
    else router.replace("/listen");
  };
  return (
    <Button
      styling="link"
      icon={<SvgChevronDown className="w-8 h-8" />}
      accessibilityLabel={t("common.back")}
      onPress={onPress}
    />
  );
};

export default LayoutBackButton;
