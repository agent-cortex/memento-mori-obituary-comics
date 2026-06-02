/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: {
    "/api/latest-pdf": ["./comics.json", "./public/comics/**/*"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
