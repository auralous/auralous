import {
  animated,
  config as springConfig,
  useTransition,
} from "@react-spring/web";
import { SvgChevronLeft } from "assets/svg";
import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Track } from "gql/gql.gen";
import { useRouterBack } from "hooks/router";
import { useI18n } from "i18n/index";
import { useEffect, useState } from "react";
import CreateStory from "./CreateStory";
import SelectTracks from "./SelectTracks";

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
    opacity: 0,
    transform: "translateY(10px)",
  },
  enter: {
    opacity: 1,
    transform: "translateY(0px)",
  },
  leave: {
    opacity: 0,
    transform: "translateY(10px)",
  },
  config: springConfig.stiff,
};

const NewContainer: React.FC = () => {
  const { t } = useI18n();
  const [, { playStory }] = usePlayer();

  const [initTracks, setInitTracks] = useState<Track[]>([]);

  const [doneSelect, setDoneSelect] = useState(false);

  useEffect(() => {
    // stop ongoing story
    playStory("");
  }, [playStory]);

  const transition = useTransition(doneSelect, transitionConfig);

  const back = useRouterBack();

  return (
    <>
      <Box
        paddingY="md"
        paddingX="sm"
        fullWidth
        justifyContent="start"
        style={{ height: "100vh", position: "relative" }}
        position="relative"
      >
        <Box row justifyContent="between">
          {doneSelect ? (
            <Button
              title={t("new.selectSongs.title")}
              icon={<SvgChevronLeft viewBox="4 4 16 16" className="w-4 h-4" />}
              onClick={() => setDoneSelect(false)}
              styling="link"
            />
          ) : (
            <>
              <Button title={t("common.back")} onClick={back} styling="link" />
              <Button
                title={t("common.next")}
                onClick={() => setDoneSelect(true)}
                disabled={initTracks.length < 4}
                color="primary"
                styling="link"
              />
            </>
          )}
        </Box>
        {!doneSelect && (
          <Typography.Title level={2} size="2xl" align="center">
            {t("new.selectSongs.title")}
          </Typography.Title>
        )}
        <Typography.Paragraph
          size="md"
          align="center"
          color="foreground-secondary"
        >
          {doneSelect ? (
            <>
              {t("new.fromResult.startListeningTo")}{" "}
              <Typography.Text strong color="foreground">
                {initTracks.length} {t("common.tracks")}
              </Typography.Text>{" "}
              {t("new.fromResult.featuring")}{" "}
              <Typography.Text emphasis color="foreground">
                {getFeaturedArtists(initTracks).join(", ")}
              </Typography.Text>
            </>
          ) : (
            <>
              {initTracks.length >= 4
                ? t("new.tracksInQueue", { num: initTracks.length })
                : t("new.promptInstruction", { min: 4 })}
            </>
          )}
        </Typography.Paragraph>
        <Box flex={1} minHeight={0} position="relative">
          {transition((style, item) =>
            item ? (
              <animated.div style={style} className="absolute w-full h-full">
                <CreateStory initTracks={initTracks} />
              </animated.div>
            ) : (
              <animated.div style={style} className="absolute w-full h-full">
                <SelectTracks
                  initTracks={initTracks}
                  setInitTracks={setInitTracks}
                  setDoneSelect={setDoneSelect}
                />
              </animated.div>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default NewContainer;
