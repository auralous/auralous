import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const isSuccess = !router.query.error;
  return (
    <>
      <NextSeo title="Authenticated" nofollow noindex />
      <div className="flex flex-col flex-center p-8 w-screen h-screen">
        <Typography.Title>
          {isSuccess ? "You are in!" : "Oooops..."}
        </Typography.Title>
        <Typography.Paragraph>
          {isSuccess
            ? "We have successfully connected to your account. Let's jam!"
            : "We could not connect to your account. Let's give it another try!"}
        </Typography.Paragraph>
        <Button title="Close window" fullWidth onPress={() => window.close()} />
      </div>
    </>
  );
};

export default AuthCallbackPage;
