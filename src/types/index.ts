import { PlatformName } from "~/graphql/gql.gen";

export interface Playlist {
  id: string;
  title: string;
  image: string;
  tracks: string[];
  platform: PlatformName;
  externalId: string;
}
