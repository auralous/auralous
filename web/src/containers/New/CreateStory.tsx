import { SvgCheck } from "assets/svg";
import { useLogin } from "components/Auth";
import { Input } from "components/Form";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { LocationInput, Track, useStoryCreateMutation } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { t as tFn, useI18n } from "i18n/index";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CONFIG } from "utils/constants";

const CreateStoryLabel: React.FC<{ htmlFor: string }> = ({
  htmlFor,
  children,
}) => (
  <label
    id={`${htmlFor}-label`}
    className="label text-foreground text-center"
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

const CreateStoryFormGroup: React.FC = ({ children }) => (
  <>
    <Box alignItems="center">{children}</Box>
    <Spacer size={4} axis="vertical" />
  </>
);

const CreateStory: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();

  const [, logIn] = useLogin();
  const me = useMe();

  const router = useRouter();

  const textRef = useRef<HTMLInputElement>(null);
  const [addLocation, setAddLocation] = useState<boolean>(false);

  const [isPublic] = useState(true);

  const [{ fetching }, createStory] = useStoryCreateMutation();

  const [loc, setLoc] = useState<LocationInput | undefined>();

  useEffect(() => {
    if (!navigator.geolocation || addLocation === false) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
      },
      () => {
        toast(tFn("new.addNew.locationDenied"));
        setAddLocation(false);
      }
    );
  }, [addLocation]);

  const handleStoryCreation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (fetching) return;

    if (!me) return logIn();

    const result = await createStory({
      text: (textRef.current as HTMLInputElement).value,
      isPublic,
      location: addLocation ? loc : undefined,
      tracks: initTracks.map((initTrack) => initTrack.id),
    });

    if (result.data?.storyCreate)
      router.replace(`/story/${result.data.storyCreate.id}`);
  };

  return (
    <form onSubmit={handleStoryCreation} autoComplete="off">
      <CreateStoryFormGroup>
        <CreateStoryLabel htmlFor="storyText">
          {t("new.addNew.promptText")}
        </CreateStoryLabel>
        <Input
          id="storyText"
          accessibilityLabel="storyText-label"
          required
          fullWidth
          type="text"
          maxLength={CONFIG.storyTextMaxLength}
          ref={textRef}
          disabled={fetching}
        />
        <Spacer size={1} axis="vertical" />
        <Typography.Paragraph size="xs" color="foreground-tertiary">
          {t("new.addNew.textHelp", { maxLength: CONFIG.storyTextMaxLength })}
        </Typography.Paragraph>
      </CreateStoryFormGroup>
      <CreateStoryFormGroup>
        <CreateStoryLabel htmlFor="storyAddLocation">
          <Box alignItems="center" gap="xs">
            <Typography.Text>{t("new.addNew.addLocation")}</Typography.Text>
            <input
              checked={!!addLocation}
              onChange={(e) => setAddLocation(e.currentTarget.checked)}
              type="checkbox"
              className="h-6 w-6 input hidden"
              id="storyAddLocation"
            />
            <Box
              backgroundColor={addLocation ? "primary" : "background-secondary"}
              width={8}
              height={8}
              alignItems="center"
              justifyContent="center"
              rounded="lg"
            >
              {addLocation && <SvgCheck className="w-8 h-8" />}
            </Box>
          </Box>
        </CreateStoryLabel>
      </CreateStoryFormGroup>
      <Spacer size={4} axis="vertical" />
      <Box row alignItems="center" justifyContent="center">
        <Button
          color="primary"
          type="submit"
          disabled={fetching}
          title={t("new.addNew.action")}
          shape="circle"
        />
      </Box>
    </form>
  );
};

export default CreateStory;
