import { getAllHeroSections } from "@/actions/hero-carousel";
import { SectionsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function HeroSectionsPage() {
    const sections = await getAllHeroSections();
    return <SectionsClient sections={sections} />;
}
