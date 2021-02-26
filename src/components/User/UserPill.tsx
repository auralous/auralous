import { Skeleton } from "components/Loading";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useUserQuery } from "gql/gql.gen";
import Link from "next/link";

const UserPill: React.FC<{ id: string; extraEl?: JSX.Element }> = ({
  id,
  extraEl,
}) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id },
  });

  return (
    <Box
      alignItems="center"
      backgroundColor="backgroundSecondary"
      rounded="lg"
      padding="sm"
    >
      <Skeleton show={!user} rounded="full">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </Skeleton>
      <Spacer size={1} axis="vertical" />
      <Skeleton show={!user} width={20} height={4}>
        <Link href={`/user/${user?.username}`}>
          <Typography.Link strong truncate>
            {user?.username}
          </Typography.Link>
        </Link>
      </Skeleton>
      {extraEl && (
        <>
          <Spacer size={2} axis="vertical" />
          {extraEl}
        </>
      )}
    </Box>
  );
};

export default UserPill;
