import { useImageColor } from "@/components/Colors";
import { useTrackQuery } from "@auralous/api";

export const useTrackColor = (trackId?: string | null) => {
  const [{ data, stale }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const image = !stale ? data?.track?.image : undefined;

  return useImageColor(image);
};
