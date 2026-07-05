import type { NextConfig } from "next";

// GLSL shader support: .glsl/.vert/.frag files import as raw strings.
// Turbopack rules cover `next dev` and `next build`; the webpack block is a
// fallback for any tooling that still runs the webpack pipeline.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.glsl": { loaders: ["raw-loader"], as: "*.js" },
      "*.vert": { loaders: ["raw-loader"], as: "*.js" },
      "*.frag": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
