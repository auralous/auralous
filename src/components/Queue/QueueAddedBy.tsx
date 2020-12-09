import React from "react";
import Link from "next/link";
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
      <Link href={`/user/${user?.username}`}>
        <a className="text-foreground font-semibold text-opacity-75">
          {user?.username || ""}
        </a>
      </Link>
    </span>
  );
};

export default QueueAddedBy;
