import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllProducts, getAllProductCategories } from "@/actions/products";
import ProductsClient from "./client";

export default async function ProductsPage() {
    const canView = await hasPermission("products.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const [productsList, categories] = await Promise.all([
        getAllProducts(),
        getAllProductCategories(),
    ]);

    return <ProductsClient products={productsList} categories={categories} />;
}
