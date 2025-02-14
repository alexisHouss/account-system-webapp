
/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  trailingSlash: false,
  swcMinify: true,
  basePath: "",
  assetPrefix : "",
  images: {
    loader: "imgix",
    path: "/",
  },
};

module.exports = nextConfig;
