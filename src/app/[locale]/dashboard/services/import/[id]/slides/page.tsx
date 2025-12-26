import { redirect, notFound } from "next/navigation";
import { getImportServiceById } from "@/actions/import";
import { getHeroSlidesByImportService, getAllHeroSections, getAvailableContentForSlides } from "@/actions/hero-carousel";
import { getAllImages } from "@/actions/images";
import { ServiceSlidesClient } from "./client";

type PageProps = {
    params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ImportServiceSlidesPage({ params }: PageProps) {
    const { id } = await params;

    const service = await getImportServiceById(id);
    if (!service) {
        notFound();
    }

    const [slides, sections, content, images] = await Promise.all([
        getHeroSlidesByImportService(id),
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
            serviceType="import"
        />
    );
}
