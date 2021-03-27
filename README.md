<p align="center">
  <a href="https://auralous.com">
    <img alt="Auralous" src="https://github.com/auralous/auralous/raw/main/web/public/images/banner.png" height="300px">
  </a>
</p>

> Music is always better when we listen together

Auralous is a free project that lets you play & listen to music in sync with friends in public or private stories.

Auralous currently supports streaming music on [YouTube](https://www.youtube.com/) and [Spotify](https://www.spotify.com/). We hope to add support for [Apple Music](https://www.apple.com/apple-music/) soon.

![CI](https://github.com/auralous/auralous/workflows/CI/badge.svg)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/ff5252)](/CONTRIBUTING.md)

Website: [withstereo.com](https://withstereo.com) (will be moved to auralous.com after `alpha`)

## Structure

| Codebase             |      Description      |
| :------------------- | :-------------------: |
| [web](web) | Next.js frontend |

### Workflows

The repository is a workspace using [yarn](https://classic.yarnpkg.com/en/docs/workspaces). Upon cloning this repository, run `yarn` to install the required dependencies.

`package.json` contains the several scripts in the workspace root.

#### `yarn codegen`

Run `yarn codegen` to run the [graphql-codegen-generator](https://github.com/dotansimha/graphql-code-generator). This generates TypeScript definitions inside [`src/graphql/gql.gen.ts`](src/graphql/gql.gen.ts) and [`urql`](https://github.com/FormidableLabs/urql) React hooks.

This is only run whenever the GraphQL operations are modified inside the `graphql` folder or when the Server GraphQL Schema changes.

#### `yarn lint`

Run `yarn lint` to check for error in source code using [`eslint`](https://github.com/eslint/eslint). You can also run `yarn lint --fix` to let `eslint` fixed the errors automatically.

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Acknowledgements

This project is not possible without:

- [All the libraries and their amazing maintainers](package.json)
- [Odesli API](https://odesli.co/)
- last but not least... **you**