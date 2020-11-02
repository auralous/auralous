<p align="center">
  <a href="https://withstereo.com">
    <img alt="Stereo" src="https://withstereo.com/images/banner.png" height="300px">
  </a>
</p>

> Music is always better when we listen together

Stereo is a completely-free and community-driven project that lets you play & listen to music in sync with friends in public or private rooms.

Stereo currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/). We hope to add support for [Apple Music](https://www.apple.com/apple-music/) soon.

![CI](https://github.com/hoangvvo/stereo-web/workflows/CI/badge.svg)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/ff5252)](/CONTRIBUTING.md)

## Other repositories

Stereo consists of several other repos containing server or mobile apps, some of which or open sourced.

- [Web](https://github.com/hoangvvo/stereo-web): The [Next.js](https://github.com/vercel/next.js) + [urql](https://formidable.com/open-source/urql/) web application.
- Server: The [Node.js](https://github.com/nodejs/node) GraphQL server using [benzene](https://github.com/hoangvvo/benzene)
- Mobile (React Native): TBD

## Development

### Prerequisites

The following tools must be installed:

- [Node](https://nodejs.org/) 12.x or 14.x ([nvm](https://github.com/nvm-sh/nvm) recommended)
- [Yarn](https://yarnpkg.com/) 1.x: See [Installation](https://classic.yarnpkg.com/en/docs/install)

### Environment variables

Certain environment variables are required to run this application:

- `APP_URI`: URL of this web app
- `API_URI`: URL of the API Server
- `WEBSOCKET_URI`: URL of the WebSocket server
- `SPOTIFY_CLIENT_ID`: The Spotify Client ID for use in the Web Playback SDK. See [developer.spotify.com](https://developer.spotify.com/)
- `FACEBOOK_APP_ID`: (optional) The Facebook App ID. See [developers.facebook.com](https://developers.facebook.com/).
- `FATHOM_SITE_ID`: (optional) [Fathom](https://usefathom.com/) site ID for analytics.
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`: (optional) Sentry environment variables: the first one for error reporting and the second for source map uploading.

Create a `.env` file in the working dir to set the variables. For development, set `APP_URI` to `https://api.withstereo.com`, `WEBSOCKET_URI` to `wss://api.withstereo.com/graphql`, and `SENTRY_DSN` to `https://foo@bar.ingest.sentry.io/0`.

> Do not commit `.env`!

### Authentication

You cannot sign in to Stereo directly from the development app. See https://github.com/hoangvvo/stereo-web/issues/17 for instruction.

### Workflows

Upon cloning this repository, run `yarn` to install required dependencies.

#### `yarn dev`

Run `yarn dev` to start the app in development mode. This enables hot-code reloading and error reporting. See [`next dev`](https://nextjs.org/docs/api-reference/cli#development).

#### `yarn codegen`

Run `yarn codegen` to run the [graphql-codegen-generator](https://github.com/dotansimha/graphql-code-generator). This generates TypeScript definitions inside [`src/graphql/gql.gen.ts`](src/graphql/gql.gen.ts) and [`urql`](https://github.com/FormidableLabs/urql) React hooks.

This is only run whenever the GraphQL operations are modified inside the `graphql` folder or when the Server GraphQL Schema changes.

#### `yarn lint`

Run `yarn lint` to check for error in source code using [`eslint`](https://github.com/eslint/eslint). You can also run `yarn lint --fix` to let `eslint` fixed the errors automatically.

#### `yarn build`

Running `yarn build` will create an optimized production build of your application. To also analyzing build size set the env variable `ANALYZE=true`.

```bash
yarn build
```

## Deployment

`stereo-web` cannot be self-hosted at the moment. However, if you are interested, I'm happy to implement a OAuth2.0-like system (available for free too if possible!) to do so. `stereo-api` cannot be open sourced now due to having a lot of moving pieces, but I hope to be able to do that soon in the future.

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation. See [LICENSE](LICENSE) file in this repository for the full text.

Feel free to email us at [yo@withstereo.com](yo@withstereo.com) with any questions and concerns.

