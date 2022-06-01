const withTM = require('next-transpile-modules')(['ui'])
const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(withContentlayer(nextConfig))
