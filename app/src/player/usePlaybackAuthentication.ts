import { useMe } from "@/gql/hooks";
import { PlatformName } from "@auralous/api";
import { useMemo } from "react";

const usePlaybackAuthentication = () => {
  /**
   * Player Authentication
   */
  const me = useMe();

  /**
   * Playing Platform
   * Preferred platform to use by user. If the user
   * is not sign in, defaulting to YouTube. However,
   * we always wait for the result of mAuth
   * so in order not to load unneccessary sdks
   */
  const playingPlatform = useMemo<PlatformName | null>(() => {
    // if mAuth === undefined, it has not fetched
    if (me === undefined) return null;
    return me?.platform || PlatformName.Youtube;
  }, [me]);

  console.log(playingPlatform, me);

  return {
    playingPlatform,
    accessToken: me?.accessToken || null,
  } as const;
};

export default usePlaybackAuthentication;
