import { PageHeader } from "components/Page";
import StoryFeed from "components/Story/StoryFeed";
import { useI18n } from "i18n/index";
import React from "react";

const ListenMain: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <PageHeader name={t("listen.title")} />
      <StoryFeed id="PUBLIC" />
    </>
  );
};

export default ListenMain;
