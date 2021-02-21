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
      backgroundColor="background-secondary"
      rounded="lg"
      padding={2}
    >
      {user ? (
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={user.profilePicture}
          alt={user.username}
        />
      ) : (
        <div className="block-skeleton w-12 h-12 rounded-full" />
      )}
      <Spacer size={1} axis="vertical" />
      {user ? (
        <Link href={`/user/${user.username}`}>
          <Typography.Link strong truncate>
            {user.username}
          </Typography.Link>
        </Link>
      ) : (
        <div className="w-20 h-5 block-skeleton" />
      )}
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
