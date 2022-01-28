import { Colors } from "@/styles/colors";

// FIXME: Temporarily remove this feature

export const useTrackColor = (trackId?: string | null) => {
  if (!trackId) return Colors.background;
  return Colors.background;
};
