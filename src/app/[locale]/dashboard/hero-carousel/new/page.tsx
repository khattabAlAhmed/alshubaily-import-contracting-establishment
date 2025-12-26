import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllHeroSections, getAvailableContentForSlides } from "@/actions/hero-carousel";
import { getAllImages } from "@/actions/images";
import { HeroSlideForm } from "./form";

export default async function NewHeroSlidePage() {
    const canCreate = await hasPermission("hero.create");
    if (!canCreate) {
        redirect("/dashboard/hero-carousel");
    }

    const [sections, content, images] = await Promise.all([
        getAllHeroSections(),
        getAvailableContentForSlides(),
        getAllImages(),
    ]);

    return (
        <HeroSlideForm
            mode="create"
            sections={sections}
            content={content}
            images={images}
        />
    );
}
