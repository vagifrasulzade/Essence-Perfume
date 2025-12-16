import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.versace.com',
      },
      {
        protocol: 'https',
        hostname: 'versace.com',
      },
      {
        protocol: 'https',
        hostname: '**.versace.com',
      },
      // Add more common perfume brand domains as needed
      {
        protocol: 'https',
        hostname: '**.dior.com',
      },
      {
        protocol: 'https',
        hostname: '**.chanel.com',
      },
      {
        protocol: 'https',
        hostname: '**.tomford.com',
      },
      {
        protocol: 'https',
        hostname: '**.burberry.com',
      },
      {
        protocol: 'https',
        hostname: '**.emporium.az',
      },
      {
        protocol: 'https',
        hostname: 'sdcdn.io',
      },
      {
        protocol: 'https',
        hostname: '**.sdcdn.io',
      },
      {
        protocol: 'https',
        hostname: '**.theperfumeshop.com',
      },
      // Cloudinary image hosting
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
    // Enable unoptimized images for external domains not in the list
    // This allows any external image URL to work
    unoptimized: false,
    // Alternative: Use domains array (deprecated but still works)
    domains: [],
  },
};

export default nextConfig;
