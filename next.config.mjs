/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reliable-tern-930.convex.cloud",
        port: "",
        // pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "wary-impala-10.convex.cloud",
        port: "",
        // pathname: "/account123/**",
      },
    ],
  },
};

export default nextConfig;
