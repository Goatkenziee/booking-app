/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Fixes npm versions of date-fns
    config.resolve.alias = {
      ...config.resolve.alias,
      'date-fns': require.resolve('date-fns'),
    };
    return config;
  },
};

export default nextConfig;
