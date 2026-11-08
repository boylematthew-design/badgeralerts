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
  // The site moved from badgeralerts.live to compoundingwins.com. Permanent
  // (308) redirects, path preserved, so old links and Google rankings carry
  // over. Only fires while the old domain is still attached in Vercel.
  async redirects() {
    return [
      ...["badgeralerts.live", "www.badgeralerts.live"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.compoundingwins.com/:path*",
        permanent: true,
      })),
      // compoundingwins.com/book is the booking link used on the Google
      // Business Profile, the contact page and anywhere else. To switch
      // booking tools, change only this destination. The destination is fixed
      // here and never comes from the request, so it can't be abused as an open
      // redirect. It's temporary (307) so browsers don't cache it forever.
      {
        source: "/book",
        destination: "https://calendar.app.google/4LUyNAGm27kxw1Rv8",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
