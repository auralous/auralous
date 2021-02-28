<p align="center">
  <a href="https://auralous.com">
    <img alt="Auralous" src="https://github.com/auralous/web/raw/main/public/images/banner.png" height="300px">
  </a>
</p>

> Music is always better when we listen together

Auralous is a free project that lets you play & listen to music in sync with friends in public or private stories.

Auralous currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/). We hope to add support for [Apple Music](https://www.apple.com/apple-music/) soon.

![CI](https://github.com/auralous/web/workflows/CI/badge.svg)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/ff5252)](/CONTRIBUTING.md)

Website: [withstereo.com](https://withstereo.com) (will be moved to auralous.com after `alpha`)
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

Create a `.env.local` file in the working dir to [set the environment variables](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables). For development, set `APP_URI` to `http://localhost:3000`, `API_URI` to `https://api.auralous.com`, `WEBSOCKET_URI` to `wss://api.auralous.com`, and `SENTRY_DSN` to `https://foo@bar.ingest.sentry.io/0`.

### Authentication

You cannot sign in to Auralous directly from the development app. See [#17](https://github.com/auralous/web/issues/17) for instruction on how to authenticate.

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

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation. See [LICENSE](LICENSE) file in this repository for the full text.

## Acknowledgements

This project is not possible without:

- [All the libraries and their amazing maintainers](package.json)
- [Odesli API](https://odesli.co/)
- last but not least... **you**
