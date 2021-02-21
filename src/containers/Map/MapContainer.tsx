import { PageHeader } from "components/Page";
import { useI18n } from "i18n/index";

const MapContainer: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <PageHeader name={t("map.title")} />
      <p className="px-4 text-lg text-foreground-secondary">
        {t("map.description")}
      </p>
      <div className="px-4 font-bold text-primary">Coming soon!</div>
    </>
  );
};

export default MapContainer;
