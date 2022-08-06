# @auralous/mobile

## Setup

### Environment variables

Create a `.env` in `mobile` (current directory):

```env
API_URI=https://api.auralous.com
WEBSOCKET_URI=wss://api.auralous.com
APP_URI=https://app.auralous.com
SPOTIFY_CLIENT_ID=spotify_client_id
FACEBOOK_APP_ID=
```

### Spotify

You will need a [Spotify Developer](https://developer.spotify.com/) to work with Spotify playback.

1. Add `auralous://sign-in/spotify/callback` as a Redirect URI.
2. Fill in the Android Package Name (`com.auralous`) and SHA1 Fingerprint (dev: `keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore -storepass android`, prod: `keytool -list -v -alias upload -keystore ./android/app/upload-keystore.keystore`) and iOS Bundle ID.

Spotify application should also be installed on the development device.

## Workflows

### `yarn start`

Start [Metro](https://facebook.github.io/metro/) Bundler. This should be run in a separate terminal.

### `yarn android`

Develop on an Android emulator or physical device.

### `yarn ios`

Develop on an iOS emulator or physical device.

## Build

### Android

1. Make sure the following have been replaced `PASTE_YOUR_UPLOAD_STORE_PASSWORD`, `PASTE_YOUR_UPLOAD_KEY_PASSWORD` (Hint: Use Editor _Find and Replace_)

2. Add the keystore file `upload-keystore.keystore` under `android/app`

3. Run the following:

```bash
cd android
./gradlew bundleRelease
```

The generated AAB can be found under `android/app/build/outputs/bundle/release/app.aab`

3. (Optional) To get the production built APK, you need to run the app using release variant:

```bash
npx react-native run-android --variant=release
```

## Debug

### Android

To debug using `adb logcat`:

```bash
adb logcat | grep -F "`adb shell ps | grep ngvvo.auralou  | tr -s [:space:] ' ' | cut -d' ' -f2`"
```
