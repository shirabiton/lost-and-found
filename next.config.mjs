/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
      ],
      domains: ['media.istockphoto.com']
    },
  };
  
  export default nextConfig;
