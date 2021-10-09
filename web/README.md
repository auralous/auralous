# @auralous/web

React Native app for Android and iOS for Auralous

## Setup

### Environment variables

Create a `.env` in the `web` (current) directory:

```env
API_URI=https://api.auralous.com
WEBSOCKET_URI=wss://api.auralous.com
APP_URI=https://app.auralous.com
SPOTIFY_CLIENT_ID=spotify_client_id
MAPBOX_ACCESS_TOKEN=PASTE_YOUR_MAPBOX_ACCESS_TOKEN
FACEBOOK_APP_ID=
```

### Spotify

You will need a [Spotify Developer](https://developer.spotify.com/) to work with Spotify playback.

### Mapbox

You will need a [Mapbox](https://www.mapbox.com/) to work on the Map Screen.

## Workflows

Make sure you have run `yarn dev` from the parent directory.

### `yarn dev`

Start [webpack-dev-server](https://github.com/webpack/webpack-dev-server) for development.

## Build

Run `yarn build` to create a production build in the `build` directory.
