import UserMain from "components/User/UserMain";
import { User } from "gql/gql.gen";
import { QUERY_USER } from "gql/user";
import { useI18n } from "i18n/index";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import NotFoundPage from "pages/404";
import { CONFIG } from "utils/constants";
import { forwardSSRHeaders } from "utils/ssr-utils";

const UserPage: NextPage<{ user: User | null }> = ({ user }) => {
  const { t } = useI18n();
  if (!user) return <NotFoundPage />;
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
      <UserMain initialUser={user} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  user: User | null;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql?query=${QUERY_USER.replace(
      /([\s,]|#[^\n\r]+)+/g,
      " "
    ).trim()}&variables=${JSON.stringify({ username: params?.username })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((response) => response.json());

  const user: User | null = result.data?.user || null;
  if (!user) res.statusCode = 404;
  else {
    res.setHeader("cache-control", `public, max-age=${CONFIG.userMaxAge}`);
  }
  return { props: { user } };
};

export default UserPage;
