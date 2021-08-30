import { useTrackQuery } from "@auralous/api";
import { useImageColor } from "@auralous/ui";

export const useTrackColor = (trackId?: string | null) => {
  const [{ data, stale }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const trackImage = !!trackId && !stale ? data?.track?.image : undefined;

  return useImageColor(trackImage);
};
