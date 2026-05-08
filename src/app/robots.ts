import type { MetadataRoute } from "next";

const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlabruni.app")
  .trim()
  .replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteOrigin,
  };
}
