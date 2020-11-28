import React, { useCallback } from "react";
import { animated } from "react-spring";
import { useToasts } from "~/components/Toast/index";
import { usePlayer } from "~/components/Player/index";
import { useCurrentUser } from "~/hooks/user";
import {
  useReactNowPlayingMutation,
  NowPlayingReactionType,
  useNowPlayingReactionsQuery,
  useOnNowPlayingReactionsUpdatedSubscription,
} from "~/graphql/gql.gen";
import { useBoop } from "~/hooks/animation";

const ReactionTypeToCode: Record<NowPlayingReactionType, string> = {
  [NowPlayingReactionType.Fire]: "1f525",
  [NowPlayingReactionType.Cry]: "1f62d",
  [NowPlayingReactionType.Heart]: "1f497",
  [NowPlayingReactionType.Joy]: "1f602",
};

const NowPlayingReactionEntry: React.FC<{
  reaction: NowPlayingReactionType;
  id: string;
}> = ({ reaction, id }) => {
  const [
    { data: { nowPlayingReactions } = { nowPlayingReactions: undefined } },
  ] = useNowPlayingReactionsQuery({
    variables: { id },
    requestPolicy: "cache-and-network",
  });

  const {
    state: { playerPlaying },
  } = usePlayer();

  const canReact = playerPlaying && !nowPlayingReactions?.mine;

  const user = useCurrentUser();
  const toasts = useToasts();

  const [, reactNowPlaying] = useReactNowPlayingMutation();

  const [style, trigger] = useBoop({
    y: 0,
    scale: 1.1,
    rotation: 10,
  });

  const react = useCallback(() => {
    if (!canReact) return;
    trigger();
    if (user) reactNowPlaying({ id, reaction });
    else toasts.message("Join to Add Your Reaction");
  }, [canReact, toasts, id, reactNowPlaying, user, reaction, trigger]);

  return (
    <button
      onClick={react}
      className={`btn btn-transparent flex-none p-1 mr-2 ${
        nowPlayingReactions?.mine === reaction ? "opacity-100" : ""
      }`}
      disabled={!canReact}
    >
      <animated.span
        onMouseEnter={trigger}
        style={style}
        className="flex items-center w-full justify-center"
      >
        <img
          alt={reaction}
          src={`https://twemoji.maxcdn.com/svg/${ReactionTypeToCode[reaction]}.svg`}
          className="w-6 mr-1 h-6"
        />
        <span className="text-foreground-secondary text-lg font-bold">
          {nowPlayingReactions?.[reaction] || 0}
        </span>
      </animated.span>
    </button>
  );
};

const NowPlayingReaction: React.FC<{ id: string }> = ({ id }) => {
  useOnNowPlayingReactionsUpdatedSubscription({ variables: { id } });

  return (
    <div className="flex text-sm overflow-y-hidden overflow-x-auto">
      <NowPlayingReactionEntry
        id={id}
        reaction={NowPlayingReactionType.Heart}
      />
      <NowPlayingReactionEntry id={id} reaction={NowPlayingReactionType.Fire} />
      <NowPlayingReactionEntry id={id} reaction={NowPlayingReactionType.Joy} />
      <NowPlayingReactionEntry id={id} reaction={NowPlayingReactionType.Cry} />
    </div>
  );
};

export default NowPlayingReaction;
