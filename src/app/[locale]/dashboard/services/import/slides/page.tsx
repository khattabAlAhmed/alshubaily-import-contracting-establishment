import { getAllImportServices, type ImportService } from "@/actions/import";
import { getHeroSlidesByImportService } from "@/actions/hero-carousel";
import { ImportSlidesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ImportSlidesPage() {
    const services = await getAllImportServices();

    // Get slide counts for each service
    const servicesWithSlideCounts = await Promise.all(
        services.map(async (service) => {
            const slides = await getHeroSlidesByImportService(service.id);
            return {
                ...service,
                slideCount: slides.length,
            };
        })
    );

    return <ImportSlidesClient services={servicesWithSlideCounts} />;
}
