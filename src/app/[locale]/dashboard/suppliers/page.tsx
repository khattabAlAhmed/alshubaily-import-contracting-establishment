import { getAllSuppliers } from "@/actions/suppliers";
import SuppliersClient from "./client";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
    const suppliers = await getAllSuppliers();

    return <SuppliersClient suppliers={suppliers} />;
}
