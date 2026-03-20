/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  images: {
    domains: ['directus-production-1dd5.up.railway.app'],
  },
  async rewrites() {
    return [
      {
        source: '/widget.js',
        destination: '/widget.js',
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

const sentryBuildOptions = {
  widenClientFileUpload: true,
  transpileClientSDKs: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  sourcemaps: {
    disable: false,
  },
  release: {
    create: true,
    setCommits: {
      auto: true,
    },
  },
};

module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryBuildOptions)
  : nextConfig;