import React from "react";
import Link from "next/link";
import UserFollowButton from "./UserFollowButton";
import { useUserQuery } from "~/graphql/gql.gen";

const UserPill: React.FC<{ id: string }> = ({ id }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id },
  });

  return (
    <div className="flex items-center rounded-full bg-background-secondary p-1">
      <div className="flex-none w-10 h-10 mr-2 rounded-full overflow-hidden">
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
          <Link href={`/user/[userId]`}>
            <a className="font-semibold truncate text-inline-link">
              {user.username}
            </a>
          </Link>
        ) : (
          <div className="w-20 h-5 block-skeleton" />
        )}
      </div>
      <UserFollowButton id={id} isTiny />
    </div>
  );
};

export default UserPill;
