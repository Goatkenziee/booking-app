/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swc: {
      // Enable SWC for all files
      // This is already the default in Next.js 13+ for client components
      // but can be explicitly set for server components or older versions.
      // For older versions or specific needs, you might need to configure:
      // isomorphicSwc: true, // if you need to support older environments
    },
  },
  compilerOptions: {
    // This key is invalid and should be removed.
  },
};

export default nextConfig;
