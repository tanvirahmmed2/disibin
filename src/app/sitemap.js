import { dbQuery } from "../lib/database/pg";
import { BASE_URL } from "../lib/database/secret";

export default async function sitemap() {
  const staticPaths = ["", "/about", "/career", "/contact", "/products", "/team"];
  const staticUrls = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  try {
    const res = await dbQuery("SELECT slug, updated_at FROM products WHERE is_active = true");
    const products = res.rows;

    const productUrls = products.map((prod) => ({
      url: `${BASE_URL}/products/${prod.slug}`,
      lastModified: new Date(prod.updated_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticUrls, ...productUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticUrls;
  }
}
