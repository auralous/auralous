import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Router from "next/router";
import { useCurrentUser } from "~/hooks/user";
import { useToasts } from "~/components/Toast/index";
import { useLogin } from "~/components/Auth/index";
import { SvgUser } from "~/assets/svg";

export const UserMenu: React.FC = () => {
  const user = useCurrentUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const toasts = useToasts();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => setIsExpanded(false);
    Router.events.on("routeChangeComplete", fn);
    return () => Router.events.off("routeChangeComplete", fn);
  }, []);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);

  const signOut = useCallback(async () => {
    await fetch(`${process.env.API_URI}/auth`, {
      method: "DELETE",
      credentials: "include",
    });
    (window as any).resetUrqlClient();
    toasts.message("You have been signed out");
    setIsExpanded(false);
  }, [toasts, setIsExpanded]);

  const [, openLogin] = useLogin();
  return (
    <>
      <button
        aria-label="Navigation menu"
        type="button"
        className="mx-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {user ? (
          <img
            alt={user.username}
            src={user.profilePicture}
            className="w-10 h-10 bg-background-secondary object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 flex place-center bg-background-secondary rounded">
            <SvgUser />
          </div>
        )}
      </button>
      <div
        ref={ref}
        className={`bg-background rounded-lg overflow-hidden absolute w-48 right-4 md:right-8 lg:right-12 xl:right-20 top-12 border-background-secondary border-2 ${
          isExpanded ? "visible" : "invisible"
        }`}
      >
        {user ? null : (
          <button
            onClick={openLogin}
            className="block w-full text-sm text-center font-bold hover:bg-background-secondary py-4"
          >
            Sign in
          </button>
        )}
        <Link href="/settings">
          <a className="block w-full text-sm text-center font-bold hover:bg-background-secondary py-4">
            Settings
          </a>
        </Link>
        {user ? (
          <button
            className="block w-full text-sm text-center font-bold hover:bg-background-secondary py-4"
            onClick={signOut}
          >
            Sign out
          </button>
        ) : null}
      </div>
    </>
  );
};
