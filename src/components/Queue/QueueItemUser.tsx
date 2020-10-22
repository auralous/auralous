import React from "react";
import { useUserQuery } from "~/graphql/gql.gen";

const QueueItemUser: React.FC<{ userId: string }> = ({ userId }) => {
  const [{ data }] = useUserQuery({
    variables: { id: userId },
  });

  return (
    <div
      className="opacity-50 absolute bottom-1 right-1"
      style={{
        fontSize: ".6rem",
      }}
    >
      {data?.user && (
        <>
          <img
            className="inline w-3 h-3 rounded-full"
            src={data.user.profilePicture}
            alt={data.user.username}
            title={data.user.username}
          />
          <span className="text-foreground"> {data.user.username}</span>
        </>
      )}
    </div>
  );
};

export default QueueItemUser;
