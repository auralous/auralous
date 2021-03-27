import { UserContainer } from "containers/User";
import { User } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { NextSeo } from "next-seo";
import { CONFIG } from "utils/constants";
import { forwardSSRHeaders } from "utils/ssr-utils";

const UserPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={user.username}
        description={t("user.description", { username: user.username })}
        canonical={`${process.env.APP_URI}/user/${user.id}`}
        openGraph={{
          images: [
            {
              url: user.profilePicture,
              alt: user.username,
            },
          ],
        }}
      />
      <UserContainer initialUser={user} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  user: User;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql` +
      `?query=query user($username: String, $id: ID) { user(username: $username, id: $id) { id username bio profilePicture } }` +
      `&variables=${JSON.stringify({ username: params?.username })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((response) => response.json());

  const user: User | null = result.data?.user || null;
  if (!user) return { notFound: true };
  else {
    res.setHeader("cache-control", `public, max-age=${CONFIG.userMaxAge}`);
  }
  return { props: { user } };
};

export default UserPage;
