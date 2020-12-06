import React from "react";
import { StoryState, useUserQuery } from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";

const CurrentUser: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="p-2 flex flex-col flex-center">
      {
        //FIXME: Add user name
        data?.user ? (
          <>
            <div className="px-2 flex-none">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={data.user.profilePicture}
                alt={data.user.username}
                title={data.user.username}
              />
            </div>
            <div className="font-semibold text-sm text-center px-2 bg-success text-white rounded-full leading-5 mt-1">
              {data.user.username}
            </div>
          </>
        ) : (
          <>
            <div className="mx-2 flex-none w-12 h-12 rounded-full bg-background-secondary animate-pulse" />
            <div className="h-4 w-12 bg-background-secondary animate-pulse rounded-full mt-1" />
          </>
        )
      }
    </div>
  );
};

const StoryListeners: React.FC<{
  storyState: StoryState;
}> = ({ storyState }) => {
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {storyState.userIds.map((userId) => (
        // TODO: react-window
        <CurrentUser key={userId} userId={userId} />
      ))}
    </div>
  );
};

export default StoryListeners;
