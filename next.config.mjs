/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            "better-sqlite3": false,
        };
    }
    // Optimization for Cloudflare
    if (config.externals) {
        config.externals.push("better-sqlite3");
    } else {
        config.externals = ["better-sqlite3"];
    }
    return config;
  },
};

export default nextConfig;
