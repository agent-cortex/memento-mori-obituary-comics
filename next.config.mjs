/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    deviceSizes: [384, 640, 768, 1080, 1440, 1920],
    imageSizes: [128, 256, 384],
    localPatterns: [
      {
        pathname: "/media/comics/**/*.jpg",
        search: "",
      },
      {
        pathname: "/media/comics/**/*.jpeg",
        search: "",
      },
      {
        pathname: "/media/comics/**/*.png",
        search: "",
      },
    ],
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    contentDispositionType: "inline",
  },
  outputFileTracingIncludes: {
    "/api/latest-pdf": ["./comics.json"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
