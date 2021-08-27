# @auralous/app

## Setup

### Environment variables

Create a `.env` in `app` (current directory):

```env
WEBSOCKET_URI=wss://api.auralous.com
API_URI=https://api.auralous.com
WEB_URI=https://auralous.com
SPOTIFY_CLIENT_ID=spotify_client_id
MAPBOX_ACCESS_TOKEN=PASTE_YOUR_MAPBOX_ACCESS_TOKEN
MAPBOX_STYLE_URL=
```

### Spotify

You will need a [Spotify Developer](https://developer.spotify.com/) to work with Spotify playback.

1. Add `auralous://sign-in/spotify/callback` as a Redirect URI.
2. Fill in the Android Package Name (`com.hoangvvo.auralous`) and SHA1 Fingerprint (`keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore`) and iOS Bundle ID.

Spotify application should also be installed on the development device.

### Mapbox

You will need a [Mapbox](https://www.mapbox.com/) to work on the Map Screen.

1. Follow the setup: https://docs.mapbox.com/android/maps/guides/install/ and https://docs.mapbox.com/ios/maps/guides/install/
2. Make sure the following have been replaced: `PASTE_YOUR_MAPBOX_DOWNLOAD_TOKEN`, `PASTE_YOUR_MAPBOX_ACCESS_TOKEN` (Hint: Use Editor _Find and Replace_)

## Workflows

Make sure you have run `yarn dev` from the parent directory.

### `yarn start`

Start [Metro](https://facebook.github.io/metro/) Bundler. This should be run in a separate terminal.

### `yarn android`

Develop on an Android emulator or physical device.

### `yarn ios`

Develop on an iOS emulator or physical device.

## Build

### Android

1. Make sure the following have been replaced `PASTE_YOUR_UPLOAD_STORE_PASSWORD`, `PASTE_YOUR_UPLOAD_KEY_PASSWORD` (Hint: Use Editor _Find and Replace_)
2. Run the following:

```bash
cd android
./gradlew bundleRelease
```

The generated AAB can be found under `android/app/build/outputs/bundle/release/app.aab`

3. (Optional) To get the production built APK, you need to run the app using release variant:

```bash
npx react-native run-android --variant=release
```
