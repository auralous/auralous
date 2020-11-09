import React from "react";
import { useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const QueueAddedBy: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <span className="ml-1 flex-none">
      {t("queue.addedBy")}{" "}
      <span className="text-foreground font-semibold text-opacity-75">
        {user?.username || ""}
      </span>
    </span>
  );
};

export default QueueAddedBy;
