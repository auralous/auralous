import { PlatformName } from "~/graphql/gql.gen";

export interface Playlist {
  id: string;
  title: string;
  image: string;
  tracks: string[];
  platform: PlatformName;
  externalId: string;
  url: string;
}

export interface MAuth {
  platform: PlatformName;
  accessToken: string;
  expiredAt?: Date;
  id: string;
}

export interface SupportArticle {
  title: string;
  subtitle: string;
  content: string;
  slug: string;
}
