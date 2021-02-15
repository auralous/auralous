import { useUserQuery } from "gql/gql.gen";

const CurrentUser: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="inline-block rounded-full overflow-hidden">
      {data?.user ? (
        <img
          className="w-8 h-8 border-foreground-tertiaryobject-cover"
          src={data.user.profilePicture}
          alt={data.user.username}
          title={data.user.username}
        />
      ) : (
        <span className="block-skeleton mx-2 flex-none w-8 h-8" />
      )}
    </div>
  );
};

const StoryListeners: React.FC<{
  userIds: string[];
}> = ({ userIds }) => {
  return (
    <div className="overflow-auto space-x-1 whitespace-nowrap">
      {userIds.map((userId) => (
        // TODO: react-window
        <CurrentUser key={userId} userId={userId} />
      ))}
    </div>
  );
};

export default StoryListeners;
