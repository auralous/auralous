# @auralous/app

The shared main app

## Setup

### Install peer dependencies as dev dependencies

Since `yarn` does not automatically install peer dependencies, we must do it manually for type checking to work properly:

```bash
yarn install-peers
```

## Workflows

### Generate SVG exports

Whenever an SVG is added or removed inside [./src/assets/svg](./src/assets/svg), the following command must be run:

```bash
yarn gen-svg
```
