import { Skeleton } from "components/Loading";
import { useUserQuery } from "gql/gql.gen";

const StoryListener: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: userId },
  });
  return (
    <div className="inline-block rounded-full overflow-hidden">
      <Skeleton show={!user}>
        <img
          className="w-8 h-8 border-foreground-tertiaryobject-cover"
          src={user?.profilePicture}
          alt={user?.username}
          title={user?.username}
        />
      </Skeleton>
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
        <StoryListener key={userId} userId={userId} />
      ))}
    </div>
  );
};

export default StoryListeners;
