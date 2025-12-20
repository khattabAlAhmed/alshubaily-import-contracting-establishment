import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllProductCategories } from "@/actions/products";
import ProductCategoriesClient from "./client";

export default async function ProductCategoriesPage() {
    const canView = await hasPermission("products.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const categories = await getAllProductCategories();

    return <ProductCategoriesClient categories={categories} />;
}
