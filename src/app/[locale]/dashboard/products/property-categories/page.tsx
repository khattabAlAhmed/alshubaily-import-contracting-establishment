import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllPropertyCategories } from "@/actions/products";
import PropertyCategoriesClient from "./client";

export default async function PropertyCategoriesPage() {
    const canView = await hasPermission("products.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const categories = await getAllPropertyCategories();

    return <PropertyCategoriesClient categories={categories} />;
}
