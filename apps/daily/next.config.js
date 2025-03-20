const { withContentlayer } = require("next-contentlayer2");
const withPWA = require("next-pwa")({
	disable: process.env.NODE_ENV === "development",
	dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = withPWA(withContentlayer(nextConfig));
