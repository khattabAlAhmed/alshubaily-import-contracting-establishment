import { notFound } from "next/navigation";
import { getSupplierById } from "@/actions/suppliers";
import SupplierForm from "../new/form";

type EditSupplierPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
    const { id } = await params;
    const supplier = await getSupplierById(id);

    if (!supplier) {
        notFound();
    }

    return <SupplierForm mode="edit" existingSupplier={supplier} />;
}
