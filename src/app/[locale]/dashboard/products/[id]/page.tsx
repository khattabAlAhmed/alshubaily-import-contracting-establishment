import { redirect, notFound } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getProductById, getAllProductCategories, getAllProperties, getAllPropertyCategories, getProductDetails } from "@/actions/products";
import ProductForm from "../new/form";

type EditProductPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
    const canEdit = await hasPermission("products.edit");
    if (!canEdit) {
        redirect("/dashboard/products");
    }

    const { id } = await params;

    const [product, categories, properties, propertyCategories] = await Promise.all([
        getProductById(id),
        getAllProductCategories(),
        getAllProperties(),
        getAllPropertyCategories(),
    ]);

    if (!product) {
        notFound();
    }

    // Fetch existing product details
    const existingDetails = await getProductDetails(id);

    return (
        <ProductForm
            mode="edit"
            existingProduct={product}
            categories={categories}
            properties={properties}
            propertyCategories={propertyCategories}
            existingDetails={existingDetails}
        />
    );
}
