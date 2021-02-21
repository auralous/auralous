import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const isSuccess = !router.query.error;
  return (
    <>
      <NextSeo title="Authenticated" nofollow noindex />
      <Box padding={8} alignItems="center">
        <Typography.Title>
          {isSuccess ? "You are in!" : "Oooops..."}
        </Typography.Title>
        <Typography.Paragraph>
          {isSuccess
            ? "We have successfully connected to your account. Let's jam!"
            : "We could not connect to your account. Let's give it another try!"}
        </Typography.Paragraph>
        <Button title="Close window" fullWidth onPress={() => window.close()} />
      </Box>
    </>
  );
};

export default AuthCallbackPage;
