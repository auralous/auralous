# stereo-web

> Music Together

This is the `stereo-web` codebase that powers [Stereo](https://withstereo.com/) Web App. It is a [Next.js](https://github.com/vercel/next.js) app written in [TypeScript](https://github.com/microsoft/TypeScript).

## What is Stereo

Stereo is a completely-free and community-driven project that lets you play & listen to music in sync with friends in public or private "rooms".

Stereo currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/).

## Other repositories

Stereo consists of several other repos containing server or mobile apps, some of which or open sourced.

- Server: The [Node.js](https://github.com/nodejs/node) with GraphQL server ([benzene](https://github.com/hoangvvo/benzene))

- Mobile (React Native): TBD

## Development

### Prerequisites

#### Local

- [Node](https://nodejs.org/) 12.x or 14.x ([nvm](https://github.com/nvm-sh/nvm) recommended)
- [Yarn](https://yarnpkg.com/) 1.x: See [Installation](https://classic.yarnpkg.com/en/docs/install)

#### Containers

TBD

### Environment variables

Certain environment variables are required to run this application:

- `APP_URI`: URL of this web app
- `API_URI`: URL of the API Server
- `WEBSOCKET_URI`: URL of the WebSocket server
- `SPOTIFY_CLIENT_ID`: The Spotify Client ID for use in the Web Playback SDK. See [developer.spotify.com](https://developer.spotify.com/)
- `FACEBOOK_APP_ID`: (optional) The Facebook App ID. See [developers.facebook.com](https://developers.facebook.com/).
- `FATHOM_SITE_ID`: (optional) [Fathom](https://usefathom.com/) site ID for analytics.
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`: (optional) Sentry environment variables: the first one for error reporting and the second for source map uploading.

#### `.env`

This project supports loading environment variables from `.env` file via [dotenv](https://github.com/motdotla/dotenv). Below is an example `.env` file:

```
API_URI=http://localhost:4000
WEBSOCKET_URI=ws://localhost:4000/websocket
APP_URI=http://localhost:3000
FACEBOOK_APP_ID=x
SPOTIFY_CLIENT_ID=x
FATHOM_SITE_ID=XYZ123
SENTRY_DSN=https://test@test.ingest.sentry.io/noop
```

> Do not commit `.env`!

### Workflows

Upon cloning this repository, run `yarn` to install required dependencies.

#### `yarn dev`

Run `yarn dev` to start the app in development mode. This enables hot-code reloading and error reporting. See [`next dev`](https://nextjs.org/docs/api-reference/cli#development).

#### `yarn codegen`

Run `yarn codegen` to run the [graphql-codegen-generator](https://github.com/dotansimha/graphql-code-generator). This generates TypeScript definitions inside [`src/graphql/gql.gen.ts`](src/graphql/gql.gen.ts) and [`urql`](https://github.com/FormidableLabs/urql) React hooks.

This is only run whenever the GraphQL operations are modified inside the `graphql` folder or when Server GraphQL Schema changes.

#### `yarn lint`

Run `yarn lint` to check for error in source code using [`eslint`](https://github.com/eslint/eslint). You can also run `yarn lint --fix` to let `eslint` fixed the errors automatically.

## Deployment

`stereo-web` can be deployed anywhere: Netlify, AWS, Vercel, Heroku, etc. `withstereo.com` is deployed on [Vercel](https://vercel.com).

As of right now, there is no way to deploy your own instance of `stereo-web`. There are two options I'm considering:

- Allow creating an `stereo-api` instance with its own database, pointing to your custom domain. Accessible via API Key + Secret. If this interests you, email me at [yo@withstereo.com](yo@withstereo.com). I hope to make it available for free.
- If `stereo-api` is open sourced in the future (which I'm planning to), you should be able to host your own server using Docker. You will be responsible for maintainance, though.

### Production build

Running `yarn build` will create an optimized production build of your application. To also analyzing build size.

```bash
yarn build
```

Set `ANALYZE` env variable to `true` to also run bundle analyzer.

```bash
ANALYZE=true yarn build
```

See [`next build`](https://nextjs.org/docs/api-reference/cli#build).

### Start the application

After building the application, run `yarn start` to start the application in production mode.  To specific a port, simply add `-p` argument.

```bash
yarn start -p PORT
```

See [`next start`](https://nextjs.org/docs/api-reference/cli#production). This can be used to run the app in your own deployment environment.:

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation. See [LICENSE](LICENSE) file in this repository for the full text.

Feel free to email us at [yo@withstereo.com](yo@withstereo.com) with any questions and concerns.

