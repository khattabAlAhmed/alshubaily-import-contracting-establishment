import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllImages } from "@/actions/images";
import { MediaClient } from "./client";

export default async function MediaPage() {
    const canView = await hasPermission("images.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const images = await getAllImages();
    const t = await getTranslations("dashboard.media");

    return (
        <MediaClient
            images={images}
            translations={{
                title: t("title"),
                description: t("description"),
                uploadImage: t("uploadImage"),
                noImages: t("noImages"),
            }}
        />
    );
}
