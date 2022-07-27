const { withContentlayer } = require('next-contentlayer')
const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
}

module.exports = withPWA(withContentlayer(nextConfig))
