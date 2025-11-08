/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@urbangenie/ui', '@urbangenie/lib', '@urbangenie/types']
}

module.exports = nextConfig