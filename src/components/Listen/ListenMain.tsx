import React from "react";
import StoryFeed from "~/components/Story/StoryFeed";
import { useI18n } from "~/i18n/index";

const ListenMain: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <div className="flex px-4 pt-6 pb-2 items-center">
        <h1 className="w-0 flex-1 font-bold text-4xl">{t("listen.title")}</h1>
      </div>
      <div className="container mx-auto">
        <StoryFeed id="PUBLIC" />
      </div>
    </>
  );
};

export default ListenMain;
