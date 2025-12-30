"use server";

import { db } from "@/lib/db/drizzle";
import { partners } from "@/lib/db/schema/partners-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type Partner = typeof partners.$inferSelect;

export type PartnerWithImage = Partner & {
    logoImage?: { id: string; url: string } | null;
};

// ==================== CRUD Operations ====================

export async function getAllPartners(): Promise<PartnerWithImage[]> {
    const result = await db
        .select({
            id: partners.id,
            nameEn: partners.nameEn,
            nameAr: partners.nameAr,
            logoImageId: partners.logoImageId,
            createdAt: partners.createdAt,
            updatedAt: partners.updatedAt,
            logoImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(partners)
        .leftJoin(images, eq(partners.logoImageId, images.id))
        .orderBy(partners.nameEn);

    return result.map((r) => ({
        ...r,
        logoImage: r.logoImage?.id ? r.logoImage : null,
    }));
}

export async function getPartnerById(id: string): Promise<PartnerWithImage | null> {
    const result = await db
        .select({
            id: partners.id,
            nameEn: partners.nameEn,
            nameAr: partners.nameAr,
            logoImageId: partners.logoImageId,
            createdAt: partners.createdAt,
            updatedAt: partners.updatedAt,
            logoImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(partners)
        .leftJoin(images, eq(partners.logoImageId, images.id))
        .where(eq(partners.id, id))
        .limit(1);

    if (result.length === 0) return null;

    return {
        ...result[0],
        logoImage: result[0].logoImage?.id ? result[0].logoImage : null,
    };
}

export async function createPartner(data: {
    nameEn: string;
    nameAr: string;
    logoImageId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(partners).values({
            id,
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            logoImageId: data.logoImageId || null,
        });
        return { success: true, message: "Partner created", id };
    } catch (error) {
        console.error("Error creating partner:", error);
        return { success: false, message: "Failed to create partner" };
    }
}

export async function updatePartner(
    id: string,
    data: {
        nameEn: string;
        nameAr: string;
        logoImageId?: string | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(partners)
            .set({
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                logoImageId: data.logoImageId || null,
            })
            .where(eq(partners.id, id));
        return { success: true, message: "Partner updated" };
    } catch (error) {
        console.error("Error updating partner:", error);
        return { success: false, message: "Failed to update partner" };
    }
}

export async function deletePartner(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(partners).where(eq(partners.id, id));
        return { success: true, message: "Partner deleted" };
    } catch (error) {
        console.error("Error deleting partner:", error);
        return { success: false, message: "Failed to delete partner" };
    }
}

import { unstable_cache } from "next/cache";

/**
 * Cached version of getAllPartners - caches for 60 seconds
 */
export const getCachedAllPartners = unstable_cache(
    getAllPartners,
    ["all-partners"],
    { revalidate: 60, tags: ["partners"] }
);
