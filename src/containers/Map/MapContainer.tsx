import { PageHeader } from "components/Page";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";

const MapContainer: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <PageHeader name={t("map.title")} />
      <Box padding="md">
        <Typography.Paragraph size="lg" color="foregroundSecondary">
          {t("map.description")}
        </Typography.Paragraph>
        <Typography.Paragraph strong color="primary">
          Coming soon!
        </Typography.Paragraph>
      </Box>
    </>
  );
};

export default MapContainer;
