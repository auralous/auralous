import React from "react";
import { useUserQuery } from "~/graphql/gql.gen";

const QueueItemUser: React.FC<{ userId: string }> = ({ userId }) => {
  const [{ data }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <div className="opacity-50">
      {data?.user && (
        <img
          className="w-6 h-6 rounded-full"
          src={data.user.profilePicture}
          alt={data.user.username}
          title={data.user.username}
        />
      )}
    </div>
  );
};

export default QueueItemUser;
