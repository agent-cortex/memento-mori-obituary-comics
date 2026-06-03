/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: {
    "/api/latest-pdf": ["./comics.json"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
