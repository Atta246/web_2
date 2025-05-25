/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly specify we're not using Babel for Next.js
  experimental: {
    forceSwcTransforms: true
  }
};

export default nextConfig;
