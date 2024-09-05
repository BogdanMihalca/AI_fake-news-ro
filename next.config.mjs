/** @type {import('next').NextConfig} */
const nextConfig = {
  // (Optional) Export as a static site
  // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
  output: "standalone",

  // Indicate that these packages should not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
};

export default nextConfig;
