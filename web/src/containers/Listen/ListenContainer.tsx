import { PageHeader } from "components/Page";
import { Spacer } from "components/Spacer";
import { StoryFeed } from "components/Story";
import { useI18n } from "i18n/index";

const ListenContainer: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <PageHeader name={t("listen.title")} />
      <StoryFeed id="PUBLIC" />
      <Spacer axis="vertical" size={12} />
    </>
  );
};

export default ListenContainer;
