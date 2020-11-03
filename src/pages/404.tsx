import React from "react";
import { NextPage } from "next";
import Link from "next/link";

const NotFoundPage: NextPage = () => (
  <div className="flex flex-col flex-center py-32">
    <h1 className="font-black text-9xl leading-none px-2">404</h1>
    <p className="text-xl text-center text-foreground-tertiary py-2">
      You hear music in the distance, but nothing can be seen here.
    </p>
    <Link href="/browse">
      <a
        type="button"
        className="inline-block mt-4 font-bold text-sm text-success hover:text-success-dark"
      >
        Go back home
      </a>
    </Link>
  </div>
);

export default NotFoundPage;
