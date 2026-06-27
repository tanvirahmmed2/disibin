import { dbQuery } from "@/lib/database/pg";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await dbQuery("SELECT name, description FROM products WHERE slug = $1", [slug]);
    const product = res.rows[0];

    if (!product) {
      return {
        title: "Product Not Found | Disibin",
      };
    }

    const cleanDescription = product.description
      ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : "Premium digital product by Disibin";

    return {
      title: `${product.name} | Disibin`,
      description: cleanDescription,
    };
  } catch (error) {
    console.error("Dynamic product metadata query failed:", error);
    return {
      title: "Product Details | Disibin",
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
