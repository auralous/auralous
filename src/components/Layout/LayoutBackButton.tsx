import React, { useContext } from "react";
import { useRouter } from "next/router";
import { SvgChevronLeft } from "~/assets/svg";
import LayoutContext from "./LayoutContext";
import { useI18n } from "~/i18n/index";

const LayoutBackButton: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { prevPathname } = useContext(LayoutContext);
  const onClick = () => {
    if (prevPathname.current) router.back();
    else router.replace("/listen");
  };
  return (
    <button
      aria-label={t("common.back")}
      className="btn btn-transparent p-0 mr-1"
      onClick={onClick}
    >
      <SvgChevronLeft className="w-8 h-8" />
    </button>
  );
};

export default LayoutBackButton;
