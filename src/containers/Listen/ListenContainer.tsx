import { PageHeader } from "components/Page";
import { StoryFeed } from "components/Story";
import { useI18n } from "i18n/index";

const ListenContainer: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <PageHeader name={t("listen.title")} />
      <StoryFeed id="PUBLIC" />
    </>
  );
};

export default ListenContainer;
