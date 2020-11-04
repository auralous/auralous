import React from "react";
import { useUserQuery } from "~/graphql/gql.gen";

const QueueAddedBy: React.FC<{ userId: string }> = ({ userId }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <span className="ml-1 flex-none">
      Added by{" "}
      <span className="text-foreground font-semibold text-opacity-75">
        {user?.username || ""}
      </span>
    </span>
  );
};

export default QueueAddedBy;
