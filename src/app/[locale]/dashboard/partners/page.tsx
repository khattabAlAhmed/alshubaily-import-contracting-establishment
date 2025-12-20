import { getAllPartners } from "@/actions/partners";
import PartnersClient from "./client";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
    const partners = await getAllPartners();

    return <PartnersClient partners={partners} />;
}
