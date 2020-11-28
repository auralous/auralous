import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const AuthCallbackPage: NextPage = () => {
  const router = useRouter();
  const isSuccess = !router.query.error;
  return (
    <>
      <NextSeo title="Authenticated" nofollow noindex />
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {isSuccess ? "You are in!" : "Oooops..."}
        </h1>
        <p className="text-center mb-4">
          {isSuccess
            ? "We have successfully connected to your account. Let's jam!"
            : "We could not connect to your account. Let's give it another try!"}
        </p>
        <button className="btn w-full" onClick={() => window.close()}>
          Close window
        </button>
      </div>
    </>
  );
};

export default AuthCallbackPage;
