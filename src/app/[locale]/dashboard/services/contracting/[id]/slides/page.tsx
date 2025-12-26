import { notFound } from "next/navigation";
import { getContractingServiceById } from "@/actions/contracting";
import { getHeroSlidesByContractingService, getAllHeroSections, getAvailableContentForSlides } from "@/actions/hero-carousel";
import { getAllImages } from "@/actions/images";
import { ServiceSlidesClient } from "@/app/[locale]/dashboard/services/import/[id]/slides/client";

type PageProps = {
    params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ContractingServiceSlidesPage({ params }: PageProps) {
    const { id } = await params;

    const service = await getContractingServiceById(id);
    if (!service) {
        notFound();
    }

    const [slides, sections, content, images] = await Promise.all([
        getHeroSlidesByContractingService(id),
        getAllHeroSections(),
        getAvailableContentForSlides(),
        getAllImages(),
    ]);

    return (
        <ServiceSlidesClient
            service={service}
            slides={slides}
            sections={sections}
            content={content}
            images={images}
            serviceType="contracting"
        />
    );
}
