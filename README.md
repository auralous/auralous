<p align="center">
  <a href="https://auralous.com">
    <img alt="Auralous" src="https://github.com/auralous/auralous/raw/main/web/public/images/banner.png" height="300px">
  </a>
</p>

> Music is always better when we listen together

Auralous is a free project that lets you play & listen to music in sync with friends in group sessions.

Auralous currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/). We hope to add support for [Apple Music](https://www.apple.com/apple-music/) soon.

![CI](https://github.com/auralous/auralous/workflows/CI/badge.svg)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/ff5252)](/CONTRIBUTING.md)

Website: [withstereo.com](https://withstereo.com) (will be moved to auralous.com after `alpha`)

## Structure

| Codebase         |                  Description                  |
| :--------------- | :-------------------------------------------: |
| [web](web)       |             React Native Web app              |
| [mobile](mobile) |     React Native app for Android and iOS      |
| [app](app)       |              The shared main app              |
| [api](api)       | GraphQL API / URQL code, hooks, and exchanges |

### Workflows

`package.json` contains the several scripts in the workspace root.

#### `yarn dev`

Start the file watcher to build common components for the project for uses in both `web` and `mobile`.

#### `yarn lint`

Run `yarn lint` to check for errors in source code using [`eslint`](https://github.com/eslint/eslint) and apply formatting with [prettier](https://github.com/prettier/prettier). You can also run `yarn lint --fix` to let `eslint` fixed the errors automatically.

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Acknowledgements

This project is not possible without:

- All the OSS libraries and their maintainers
- [Odesli API](https://odesli.co/) for cross-playing functionality
- last but not least... **you**
