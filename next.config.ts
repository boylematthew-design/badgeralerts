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
        // This guide is unpublished (content now lives on the
        // /test/landingpagemaps experiment instead). Redirect rather than
        // letting the old URL 404, so any existing links/SEO value aren't lost.
        source: "/blog/google-maps-marketing-guide",
        destination: "/test/landingpagemaps",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
