import { redirect, notFound } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getHeroSlideById, getAllHeroSections, getAvailableContentForSlides } from "@/actions/hero-carousel";
import { getAllImages } from "@/actions/images";
import { HeroSlideForm } from "../new/form";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditHeroSlidePage({ params }: PageProps) {
    const { id } = await params;

    const canEdit = await hasPermission("hero.edit");
    if (!canEdit) {
        redirect("/dashboard/hero-carousel");
    }

    const slide = await getHeroSlideById(id);
    if (!slide) {
        notFound();
    }

    const [sections, content, images] = await Promise.all([
        getAllHeroSections(),
        getAvailableContentForSlides(),
        getAllImages(),
    ]);

    return (
        <HeroSlideForm
            mode="edit"
            sections={sections}
            content={content}
            images={images}
            existingSlide={slide}
        />
    );
}
