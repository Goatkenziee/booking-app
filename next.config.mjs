/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Removed the incorrect 'swc' configuration here as it's not needed for Next.js 14+
    // and can cause issues. The default SWC behavior is generally optimized.
  },
  // Ensure that all necessary modules are included for SWC compilation if needed,
  // though typically Next.js handles this automatically.
  // If specific SWC options are required, they should be configured differently.
};

export default nextConfig;
