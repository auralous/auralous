import StoryFeed from "components/Story/StoryFeed";
import { useI18n } from "i18n/index";
import React from "react";

const ListenMain: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <h1 className="page-title">{t("listen.title")}</h1>
      <StoryFeed id="PUBLIC" />
    </>
  );
};

export default ListenMain;
