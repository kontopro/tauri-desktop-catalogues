
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  // main BasePath
  basePath: '',
  // for Electron basePath
  // basePath: '/Users/dad/code/electron-desktop-catalogues/out',
  output: 'export',
  images: { unoptimized: true },
   
  }
  module.exports = nextConfig