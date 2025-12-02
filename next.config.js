/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "medusa-server-testing.s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "oga-storage.s3.eu-central-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "cdn.nadirgold.com",
            },
            {
                protocol: "https",
                hostname: "cdn.nadirgold.com",
            },


        ],
    },
};

module.exports = nextConfig;
