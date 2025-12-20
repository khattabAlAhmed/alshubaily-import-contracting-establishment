import { notFound } from "next/navigation";
import { getPartnerById } from "@/actions/partners";
import PartnerForm from "../new/form";

type EditPartnerPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditPartnerPage({ params }: EditPartnerPageProps) {
    const { id } = await params;
    const partner = await getPartnerById(id);

    if (!partner) {
        notFound();
    }

    return <PartnerForm mode="edit" existingPartner={partner} />;
}
