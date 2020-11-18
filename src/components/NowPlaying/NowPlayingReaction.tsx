import React, { useRef, useEffect, useCallback } from "react";
import { useToasts } from "~/components/Toast/index";
import { usePlayer } from "~/components/Player/index";
import { useCurrentUser } from "~/hooks/user";
import {
  useReactNowPlayingMutation,
  NowPlayingReactionType,
  NowPlayingReactionPartsFragment,
  useNowPlayingReactionsQuery,
  useOnNowPlayingReactionsUpdatedSubscription,
} from "~/graphql/gql.gen";

const NowPlayingReaction: React.FC<{ id: string }> = ({ id }) => {
  const {
    state: { playerPlaying },
  } = usePlayer();
  const user = useCurrentUser();
  const toasts = useToasts();
  const btnCrying = useRef<HTMLButtonElement>(null);
  const btnHeart = useRef<HTMLButtonElement>(null);
  const btnFire = useRef<HTMLButtonElement>(null);
  const btnTearJoy = useRef<HTMLButtonElement>(null);
  const prevNowPlayingReaction = useRef<NowPlayingReactionPartsFragment>({
    id,
    mine: null,
    cry: 0,
    heart: 0,
    fire: 0,
    joy: 0,
  }).current;
  const [{ data }] = useNowPlayingReactionsQuery({
    variables: { id },
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingReactionsUpdatedSubscription({ variables: { id } });
  const nowPlayingReaction = data?.nowPlayingReactions;

  const [, reactNowPlaying] = useReactNowPlayingMutation();

  const react = useCallback(
    (reaction: NowPlayingReactionType) => {
      if (user) reactNowPlaying({ id, reaction });
      else toasts.message("Join to Add Your Reaction");
    },
    [toasts, id, reactNowPlaying, user]
  );

  const canReact = playerPlaying && !nowPlayingReaction?.mine;

  const getClassname = (type: NowPlayingReactionType) =>
    `flex-1 button transform transition p-1 mr-1 ${
      nowPlayingReaction?.mine === type
        ? "bg-pink opacity-100"
        : "bg-opacity-25"
    }`;

  useEffect(() => {
    // Add animation to buttons
    if (!nowPlayingReaction) return;
    if (nowPlayingReaction.fire > prevNowPlayingReaction.fire) {
      btnFire.current?.classList.add("scale-75");
      setTimeout(() => btnFire.current?.classList.remove("scale-75"), 200);
    }
    if (nowPlayingReaction.cry > prevNowPlayingReaction.cry) {
      btnCrying.current?.classList.add("scale-75");
      setTimeout(() => btnCrying.current?.classList.remove("scale-75"), 200);
    }
    if (nowPlayingReaction.heart > prevNowPlayingReaction.heart) {
      btnHeart.current?.classList.add("scale-75");
      setTimeout(() => btnHeart.current?.classList.remove("scale-75"), 200);
    }
    if (nowPlayingReaction.joy > prevNowPlayingReaction.joy) {
      btnTearJoy.current?.classList.add("scale-75");
      setTimeout(() => btnTearJoy.current?.classList.remove("scale-75"), 200);
    }
    Object.assign(prevNowPlayingReaction, nowPlayingReaction);
  }, [
    prevNowPlayingReaction,
    nowPlayingReaction,
    btnCrying,
    btnTearJoy,
    btnHeart,
    btnFire,
  ]);

  return (
    <div className="flex text-sm">
      <button
        ref={btnHeart}
        onClick={() => react(NowPlayingReactionType.Heart)}
        className={getClassname(NowPlayingReactionType.Heart)}
        disabled={!canReact}
      >
        <span role="img" aria-label="Heart">
          {nowPlayingReaction?.heart || 0} ❤️
        </span>
      </button>
      <button
        ref={btnFire}
        className={getClassname(NowPlayingReactionType.Fire)}
        onClick={() => react(NowPlayingReactionType.Fire)}
        disabled={!canReact}
      >
        <span role="img" aria-label="Fire">
          {nowPlayingReaction?.fire || 0} 🔥
        </span>
      </button>
      <button
        ref={btnTearJoy}
        className={getClassname(NowPlayingReactionType.Joy)}
        onClick={() => react(NowPlayingReactionType.Joy)}
        disabled={!canReact}
      >
        <span role="img" aria-label="Face with Tears of Joy">
          {nowPlayingReaction?.joy || 0} 😂
        </span>
      </button>
      <button
        ref={btnCrying}
        className={getClassname(NowPlayingReactionType.Cry)}
        onClick={() => react(NowPlayingReactionType.Cry)}
        disabled={!canReact}
      >
        <span role="img" aria-label="Fire">
          {nowPlayingReaction?.cry || 0} 😢
        </span>
      </button>
    </div>
  );
};

export default NowPlayingReaction;
