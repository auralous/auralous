import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { LoadingDots } from "./common";
import { PlatformName, Track, useSearchTrackQuery } from "~/graphql/gql.gen";
import { useMAuth } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import { SvgSearch } from "~/assets/svg";

const isURL = (url?: string): URL | false => {
  if (!url) return false;
  try {
    return new URL(url);
  } catch (e) {
    return false;
  }
};

const SelectFromSearch: React.FC<{
  onSelected(tracks: Track[]): void;
}> = ({ onSelected }) => {
  const { t } = useI18n();

  const { data: mAuth } = useMAuth();

  const router = useRouter();
  const searchQuery = router.query.search as string | undefined;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = searchQuery || "";
  }, [searchQuery]);

  const isValidQuery = isURL(searchQuery);

  const [
    { data: { searchTrack } = { searchTrack: undefined }, fetching },
  ] = useSearchTrackQuery({
    variables: {
      query: decodeURIComponent(searchQuery || ""),
      platform: mAuth?.platform || PlatformName.Youtube,
    },
    pause: !isValidQuery,
  });

  useEffect(() => {
    if (isValidQuery && searchTrack && searchTrack.length > 0) {
      const to = window.setTimeout(() => onSelected(searchTrack), 2000);
      return () => window.clearTimeout(to);
    }
  }, [searchTrack, onSelected, isValidQuery]);

  // either show loading indicator when we are loading or just waiting to move on
  const formDisabled = Boolean(
    isValidQuery && (fetching || searchTrack?.length)
  );

  return (
    <div className="flex flex-col flex-center h-48">
      <p className="text-lg text-center text-foreground-secondary mb-2">
        {!searchTrack?.length && !fetching && !!searchQuery
          ? t("new.fromSearch.noResults")
          : t("new.fromSearch.helpText")}
      </p>
      <form
        className="h-42 w-full flex items-center"
        onSubmit={(event) => {
          event.preventDefault();
          if (fetching) return;
          const s = inputRef.current?.value.trim();
          s && router.replace(`/new?search=${encodeURIComponent(s)}`);
        }}
      >
        <input
          ref={inputRef}
          placeholder="example.com/my-awesome-playlist"
          aria-label={t("new.fromSearch.altText")}
          className="input w-0 flex-1 mr-1"
          required
          disabled={formDisabled}
        />
        <button
          type="submit"
          title={t("new.fromSearch.action")}
          className="btn bg-pink hover:bg-pink-dark w-12 h-10"
          aria-label={t("room.queue.search")}
          disabled={formDisabled}
        >
          {formDisabled ? <LoadingDots /> : <SvgSearch />}
        </button>
      </form>
    </div>
  );
};

export default SelectFromSearch;
