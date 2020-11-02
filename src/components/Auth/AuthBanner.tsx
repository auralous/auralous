import React from "react";
import { useLogin } from "./LogIn";

const AuthBanner: React.FC<{ prompt: string; hook?: string }> = ({
  prompt,
  hook,
}) => {
  const [, openLogin] = useLogin();

  return (
    <div className="flex flex-col items-center px-4 py-8 w-full max-w-2xl mx-auto">
      <p className="font-bold text-center mb-2">{prompt}</p>
      <p className="text-foreground-secondary text-sm mb-4 text-center">
        {hook ||
          `Start listening to music in sync with friends in public or private
        rooms. All you need is an YouTube, Spotify, or Apple Music account.`}
      </p>
      <button onClick={openLogin} className="button w-128 max-w-full">
        Join now
      </button>
    </div>
  );
};

export default AuthBanner;
