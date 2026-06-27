import { BASE_URL } from "../lib/database/secret";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/user/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
