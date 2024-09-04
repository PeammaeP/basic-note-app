/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure that TypeScript and JSX/TSX files are handled properly
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: "babel-loader", // Use babel-loader for JSX/TSX support
          options: {
            presets: ["next/babel"], // Use Next.js Babel preset
          },
        },
      ],
      exclude: /node_modules/,
    });

    // Fallbacks for client-side only modules if necessary
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;
