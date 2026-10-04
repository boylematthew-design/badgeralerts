import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      // Admin image uploads (blog tips, alerts/posts) go through Server
      // Actions as multipart/form-data. Next's default cap here is 1MB,
      // which is below the 2MB we tell admins is fine to upload — raise
      // it so a normal photo/screenshot doesn't get rejected mid-upload.
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        // This guide is unpublished on badgeralerts.live — it now has its
        // own permanent home on a dedicated domain, so this is a real
        // (permanent) redirect rather than the temporary one used while
        // localmapsmarketing.online was still just a test/experiment.
        source: "/blog/google-maps-marketing-guide",
        destination: "https://localmapsmarketing.online",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
