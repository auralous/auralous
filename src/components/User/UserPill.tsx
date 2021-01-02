import React from "react";
import Link from "next/link";
import { useUserQuery } from "~/graphql/gql.gen";

const UserPill: React.FC<{ id: string; rightEl?: JSX.Element }> = ({
  id,
  rightEl,
}) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id },
  });

  return (
    <div className="flex items-center p-1">
      <div className="flex-none w-8 h-8 mr-2 rounded-full overflow-hidden">
        {user ? (
          <img
            className="w-full h-full object-cover"
            src={user.profilePicture}
            alt={user.username}
          />
        ) : (
          <div className="block-skeleton w-full h-full" />
        )}
      </div>
      <div className="mr-2">
        {user ? (
          <Link href={`/user/${id}`}>
            <a className="font-semibold truncate text-inline-link">
              {user.username}
            </a>
          </Link>
        ) : (
          <div className="w-20 h-5 block-skeleton" />
        )}
      </div>
      {rightEl}
    </div>
  );
};

export default UserPill;