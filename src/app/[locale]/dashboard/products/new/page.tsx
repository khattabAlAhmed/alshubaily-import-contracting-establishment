import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllProductCategories, getAllProperties, getAllPropertyCategories } from "@/actions/products";
import ProductForm from "./form";

export default async function NewProductPage() {
    const canCreate = await hasPermission("products.create");
    if (!canCreate) {
        redirect("/dashboard/products");
    }

    const [categories, properties, propertyCategories] = await Promise.all([
        getAllProductCategories(),
        getAllProperties(),
        getAllPropertyCategories(),
    ]);

    return (
        <ProductForm
            mode="create"
            categories={categories}
            properties={properties}
            propertyCategories={propertyCategories}
        />
    );
}
