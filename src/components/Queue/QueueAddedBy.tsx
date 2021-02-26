import { Typography } from "components/Typography";
import { useUserQuery } from "gql/gql.gen";
import { useI18n } from "i18n/index";

const QueueAddedBy: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <Typography.Text>
      {t("queue.addedBy")}{" "}
      <Typography.Text strong>{user?.username || ""}</Typography.Text>
    </Typography.Text>
  );
};

export default QueueAddedBy;
