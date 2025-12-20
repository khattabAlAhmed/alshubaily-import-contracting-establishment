import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    getAllProperties,
    getAllPropertyCategories,
    createProperty,
    updateProperty,
    deleteProperty,
    type Property,
    type PropertyCategory,
} from "@/actions/products";
import PropertiesClient from "./client";

export default async function PropertiesPage() {
    const canView = await hasPermission("products.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const [propertiesList, categories] = await Promise.all([
        getAllProperties(),
        getAllPropertyCategories(),
    ]);

    return (
        <PropertiesClient
            properties={propertiesList}
            categories={categories}
        />
    );
}
