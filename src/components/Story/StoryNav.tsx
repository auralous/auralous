import React, { useMemo } from "react";
import Link from "next/link";
import ms from "ms";
import { useUserQuery, Story } from "~/graphql/gql.gen";

const StoryNav: React.FC<{ story: Story }> = ({ story }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId || "" },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  return (
    <div className="flex w-full">
      {user ? (
        <img
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
          src={user.profilePicture}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-25" />
      )}
      <div className="p-1 leading-4">
        <div>
          <Link href={`/user/${user?.username}`}>
            <a className="font-semibold mr-2">{user?.username}</a>
          </Link>{" "}
          <span className="text-xs text-foreground-secondary">{dateStr}</span>
        </div>
        <div className="text-sm text-foreground-secondary">{story.text}</div>
      </div>
    </div>
  );
};

export default StoryNav;
