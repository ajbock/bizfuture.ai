import type { NextConfig } from "next";

// Local-dev-only workaround for a corporate-laptop SSL certificate issue.
// Never applies in production (Vercel sets NODE_ENV=production automatically).
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "myegxazkxzsobkpyzayu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;