import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Track } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { animated, config as springConfig, useTransition } from "react-spring";
import CreateStory from "./CreateStory";
import SelectFromPlaylists from "./SelectFromPlaylists";
import SelectFromSearch from "./SelectFromSearch";

const getFeaturedArtists = (tracks: Track[]): string[] => {
  const o: Record<string, number> = {};
  for (const track of tracks)
    for (const artist of track.artists)
      o[artist.name] = o[artist.name] ? o[artist.name] + 1 : 1;
  return Object.entries(o)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 4);
};

const transitionConfig = {
  from: {
    height: "12rem",
    opacity: 0,
    transform: "translateY(10px)",
    position: "static" as const,
  },
  enter: {
    opacity: 1,
    transform: "translateY(0px)",
    position: "static" as const,
  },
  leave: {
    opacity: 0,
    transform: "translateY(10px)",
    position: "absolute" as const,
  },
  config: springConfig.stiff,
};

const AnimatedBox = animated(Box);

const SelectTracksView: React.FC<{
  setInitTracks: React.Dispatch<React.SetStateAction<Track[] | null>>;
}> = ({ setInitTracks }) => {
  const { t } = useI18n();
  const [from, setFrom] = useState<"search" | "playlist">("search");

  const router = useRouter();

  useEffect(() => {
    if (router.query.playlist) setFrom("playlist");
    else if (router.query.search) setFrom("search");
  }, [router]);

  const transitionsFrom = useTransition(from, null, transitionConfig);

  return (
    <>
      {transitionsFrom.map(({ item: from, key, props }) =>
        from === "search" ? (
          <AnimatedBox
            key={key}
            fullWidth
            // @ts-ignore
            style={props}
            justifyContent="center"
            alignItems="center"
          >
            <SelectFromSearch onSelected={setInitTracks} />
          </AnimatedBox>
        ) : (
          <AnimatedBox
            key={key}
            fullWidth
            // @ts-ignore
            style={props}
            justifyContent="center"
            alignItems="center"
          >
            <SelectFromPlaylists onSelected={setInitTracks} />
          </AnimatedBox>
        )
      )}
      <Box alignItems="center" gap="xs">
        <Spacer size={8} axis="vertical" />
        <Typography.Text uppercase color="foreground-tertiary" size="sm" strong>
          {t("new.or")}
        </Typography.Text>
        <Spacer size={8} axis="vertical" />
        <Button
          onPress={() =>
            from === "search" ? setFrom("playlist") : setFrom("search")
          }
          title={
            from === "search"
              ? t("new.fromPlaylist.title")
              : t("new.fromSearch.title")
          }
          shape="circle"
        />
        <Button
          onPress={() => setInitTracks([])}
          styling="link"
          title={t("new.startEmpty")}
          size="sm"
        />
      </Box>
    </>
  );
};

const CreateStoryView: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <>
      {initTracks.length ? (
        <Typography.Paragraph
          size="lg"
          align="center"
          color="foreground-secondary"
        >
          {t("new.fromResult.startListeningTo")}{" "}
          <Typography.Text strong color="foreground">
            {initTracks.length} {t("common.tracks")}
          </Typography.Text>{" "}
          {t("new.fromResult.featuring")}{" "}
          <Typography.Text emphasis color="foreground">
            {getFeaturedArtists(initTracks).join(", ")}
          </Typography.Text>
        </Typography.Paragraph>
      ) : null}
      <Spacer size={4} axis="vertical" />
      <CreateStory initTracks={initTracks} />
      <Spacer size={2} axis="vertical" />
      <Box alignItems="center">
        <Button
          size="sm"
          styling="link"
          onPress={() => router.replace("/new")}
          title={t("common.back")}
        />
      </Box>
    </>
  );
};

const NewContainer: React.FC = () => {
  const { t } = useI18n();
  const { playStory } = usePlayer();

  const [initTracks, setInitTracks] = useState<Track[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    // stop ongoing story
    playStory("");
  }, [playStory]);

  useEffect(() => {
    if (router.asPath === "/new") setInitTracks(null);
  }, [router]);

  const transitionsCreate = useTransition(!!initTracks, null, transitionConfig);

  return (
    <>
      <Box padding="md" fullWidth>
        <Spacer size={4} axis="vertical" />
        <Typography.Title level={2} size="4xl" align="center">
          {initTracks ? t("new.promptAlmost") : t("new.prompt")}
        </Typography.Title>
        <Box paddingY="lg">
          {transitionsCreate.map(({ item: doneSelected, key, props }) =>
            doneSelected ? (
              <animated.div key={key} style={props} className="w-full">
                <CreateStoryView initTracks={initTracks || []} />
              </animated.div>
            ) : (
              <animated.div key={key} style={props} className="w-full">
                <SelectTracksView setInitTracks={setInitTracks} />
              </animated.div>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default NewContainer;
