import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useUserQuery } from "gql/gql.gen";
import Link from "next/link";

const UserPill: React.FC<{ id: string; rightEl?: JSX.Element }> = ({
  id,
  rightEl,
}) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id },
  });

  return (
    <Box alignItems="center" padding={1}>
      <div className="flex-none w-8 h-8 rounded-full overflow-hidden">
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
      <Spacer size={2} axis="horizontal" />
      {user ? (
        <Link href={`/user/${user.username}`}>
          <Typography.Link strong truncate>
            {user.username}
          </Typography.Link>
        </Link>
      ) : (
        <div className="w-20 h-5 block-skeleton" />
      )}
      {rightEl && (
        <>
          <Spacer size={2} axis="horizontal" />
          {rightEl}
        </>
      )}
    </Box>
  );
};

export default UserPill;
