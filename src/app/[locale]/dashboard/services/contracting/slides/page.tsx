import { getAllContractingServices } from "@/actions/contracting";
import { getHeroSlidesByContractingService } from "@/actions/hero-carousel";
import { ContractingSlidesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ContractingSlidesPage() {
    const services = await getAllContractingServices();

    // Get slide counts for each service
    const servicesWithSlideCounts = await Promise.all(
        services.map(async (service) => {
            const slides = await getHeroSlidesByContractingService(service.id);
            return {
                ...service,
                slideCount: slides.length,
            };
        })
    );

    return <ContractingSlidesClient services={servicesWithSlideCounts} />;
}
