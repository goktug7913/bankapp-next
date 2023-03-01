/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove the "Powered by Next.js" header, it's not needed
  
}

module.exports = nextConfig // Can't convert to ES6 module, Next.js doesn't support it yet apparently
