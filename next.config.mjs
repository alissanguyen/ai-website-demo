/** @type {import('next').NextConfig} */
import { config } from "dotenv";
config();

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add html-loader for HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: "html-loader",
    });

    // Exclude @mapbox/node-pre-gyp module from being processed by Webpack
    config.externals = config.externals || {};
    config.externals["@mapbox/node-pre-gyp"] = "@mapbox/node-pre-gyp";

    return config;
  },
};

export default nextConfig;