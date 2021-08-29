import type { ImageURISource } from "react-native";

export const ImageSources = {} as {
  defaultPlaylist: ImageURISource;
  defaultTrack: ImageURISource;
  defaultUser: ImageURISource;
  spotifyLogoRGBWhite: ImageURISource;
  ytLogoMonoDark: ImageURISource;
};

export const setImageSources = (sources: typeof ImageSources) => {
  Object.assign(ImageSources, sources);
};
