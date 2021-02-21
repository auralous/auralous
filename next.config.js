/* eslint-disable @typescript-eslint/no-var-requires */
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const { name, version } = require("./package.json");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  env: {
    APP_URI: process.env.APP_URI,
    API_URI: process.env.API_URI,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    WEBSOCKET_URI: process.env.WEBSOCKET_URI,
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: `${name}@${version}`,
  },
  experimental: {
    plugins: true,
  },
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }
    if (process.env.NODE_ENV === "production") {
      if (process.env.SENTRY_AUTH_TOKEN) {
        process.env.SENTRY_ORG = "hoangvvo";
        process.env.SENTRY_PROJECT = "stereo-web";
        config.plugins.push(
          new SentryWebpackPlugin({
            include: ".next",
            ignore: ["node_modules"],
            stripPrefix: ["webpack://_N_E/"],
            urlPrefix: "~/_next",
            release: `${name}@${version}`,
            silent: true,
          })
        );
      } else {
        console.warn(
          "Missing SENTRY_AUTH_TOKEN environment variables: Source Maps will not be uploaded."
        );
      }
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { svgoConfig: { plugins: { removeViewBox: false } } },
        },
      ],
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination:
          "https://www.notion.so/Privacy-9c3b40fb8e5647e894f9e161f6811e5e",
        permanent: false,
      },
      {
        source: "/faq",
        destination:
          "https://www.notion.so/FAQ-daa9bf2b05e94ba28254f8795fbf6095",
        permanent: false,
      },
      {
        source: "/faq/oauth-permissions",
        destination:
          "https://www.notion.so/OAuth-Permissions-d4cc68ce545647338154aa38e73c14f6",
        permanent: false,
      },
      {
        source: "/contact/facebook",
        destination: "https://www.facebook.com/auralous/",
        permanent: true,
      },
      {
        source: "/contact/twitter",
        destination: "https://twitter.com/auralous_app",
        permanent: true,
      },
    ];
  },
});
