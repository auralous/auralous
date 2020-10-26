# stereo-web

> Music Together

This is the `stereo-web` codebase that powers [Stereo Web App](https://withstereo.com/). It is a [Next.js](https://github.com/vercel/next.js) app written in [TypeScript](https://github.com/microsoft/TypeScript).

## What is Stereo

Stereo is a completely-free and community-driven project that lets you play & listen to music in sync with friends in public or private rooms.

Stereo currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/).

## Other repositories

Stereo consists of several other repos containing server or mobile apps, some of which or open sourced.

- Server: The [Node.js](https://github.com/nodejs/node) GraphQL server
- Mobile (React Native): TBD

## Development

### Prerequisites

The following tools must be installed:

- [Node](https://nodejs.org/) 12.x or 14.x ([nvm](https://github.com/nvm-sh/nvm) recommended)
- [Yarn](https://yarnpkg.com/) 1.x: See [Installation](https://classic.yarnpkg.com/en/docs/install)
- [Caddy](https://caddyserver.com/). Get it at [Download](https://caddyserver.com/download) then see [Caddy Setup](#caddy-setup).

### Environment variables

Certain environment variables are required to run this application:

- `APP_URI`: URL of this web app
- `API_URI`: URL of the API Server
- `WEBSOCKET_URI`: URL of the WebSocket server
- `SPOTIFY_CLIENT_ID`: The Spotify Client ID for use in the Web Playback SDK. See [developer.spotify.com](https://developer.spotify.com/)
- `FACEBOOK_APP_ID`: (optional) The Facebook App ID. See [developers.facebook.com](https://developers.facebook.com/).
- `FATHOM_SITE_ID`: (optional) [Fathom](https://usefathom.com/) site ID for analytics.
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`: (optional) Sentry environment variables: the first one for error reporting and the second for source map uploading.

Create a `.env` file in the working dir to set the variables. For development, set `APP_URI` to `http://localhost:4000`, `WEBSOCKET_URI` to `ws://localhost:4000`, and `SENTRY_DSN` to `https://foo@bar.ingest.sentry.io/0`.

> Do not commit `.env`!

### API Server Proxy

#### Caddy Setup

For development, we use [Caddy Server](https://caddyserver.com/) to proxy requests from our local API Server at [localhost:4000](http://localhost:4000) to our production server at [api.withstereo.com](https://api.withstereo.com).

After downloading the approriate Caddy package, place it in a folder of your choice. In the same folder, create a `Caddyfile`:

```
http://localhost:4000 {
    @options {
      method OPTIONS
    }
    respond @options 204
    reverse_proxy * https://api.withstereo.com {
      header_up Host {http.reverse_proxy.upstream.hostport}
    }
    header * {
      access-control-allow-credentials true
      access-control-allow-origin http://localhost:3000
      access-control-request-method "GET, POST, OPTIONS"
      access-control-allow-headers "authorization, cache-control, content-type, dnt, if-modified-since, user-agent"
      -set-cookie
    }
}
```

Start the reverse proxy service with:

```bash
./caddy_{os}_{arch} start
```

When you're done, stop the service with:

```bash
./caddy_{os}_{arch} stop
```

#### Authentication

You cannot sign in to Stereo directly from the development app. To authenticate, login on https://withstereo.com/ and copy the  `sid` cookie value. Run the following in console devtool while at http://localhost:3000 and reload the page:

```js
document.cookie = "sid={COPIED_COOKIE_VALUE}"
```

### Workflows

Upon cloning this repository, run `yarn` to install required dependencies.

#### `yarn dev`

Run `yarn dev` to start the app in development mode. This enables hot-code reloading and error reporting. See [`next dev`](https://nextjs.org/docs/api-reference/cli#development).

#### `yarn codegen`

Run `yarn codegen` to run the [graphql-codegen-generator](https://github.com/dotansimha/graphql-code-generator). This generates TypeScript definitions inside [`src/graphql/gql.gen.ts`](src/graphql/gql.gen.ts) and [`urql`](https://github.com/FormidableLabs/urql) React hooks.

This is only run whenever the GraphQL operations are modified inside the `graphql` folder or when Server GraphQL Schema changes.

#### `yarn lint`

Run `yarn lint` to check for error in source code using [`eslint`](https://github.com/eslint/eslint). You can also run `yarn lint --fix` to let `eslint` fixed the errors automatically.

#### `yarn build`

Running `yarn build` will create an optimized production build of your application. To also analyzing build size set the env variable `ANALYZE=true`.

```bash
yarn build
```

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation. See [LICENSE](LICENSE) file in this repository for the full text.

Feel free to email us at [yo@withstereo.com](yo@withstereo.com) with any questions and concerns.

