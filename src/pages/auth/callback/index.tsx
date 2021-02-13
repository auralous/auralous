import { Button } from "components/Button";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const isSuccess = !router.query.error;
  return (
    <>
      <NextSeo title="Authenticated" nofollow noindex />
      <div className="flex flex-col flex-center p-8 w-screen h-screen">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {isSuccess ? "You are in!" : "Oooops..."}
        </h1>
        <p className="text-center mb-4">
          {isSuccess
            ? "We have successfully connected to your account. Let's jam!"
            : "We could not connect to your account. Let's give it another try!"}
        </p>
        <Button title="Close window" fullWidth onPress={() => window.close()} />
      </div>
    </>
  );
};

export default AuthCallbackPage;
