import { getProductMetadataBySlug } from "@/lib/services/publicLegal";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const product = await getProductMetadataBySlug(slug);

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
