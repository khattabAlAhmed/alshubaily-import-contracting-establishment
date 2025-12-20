"use server";

import { db } from "@/lib/db/drizzle";
import { suppliers } from "@/lib/db/schema/partners-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type Supplier = typeof suppliers.$inferSelect;

export type SupplierWithImage = Supplier & {
    logoImage?: { id: string; url: string } | null;
};

// ==================== CRUD Operations ====================

export async function getAllSuppliers(): Promise<SupplierWithImage[]> {
    const result = await db
        .select({
            id: suppliers.id,
            nameEn: suppliers.nameEn,
            nameAr: suppliers.nameAr,
            logoImageId: suppliers.logoImageId,
            createdAt: suppliers.createdAt,
            updatedAt: suppliers.updatedAt,
            logoImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(suppliers)
        .leftJoin(images, eq(suppliers.logoImageId, images.id))
        .orderBy(suppliers.nameEn);

    return result.map((r) => ({
        ...r,
        logoImage: r.logoImage?.id ? r.logoImage : null,
    }));
}

export async function getSupplierById(id: string): Promise<SupplierWithImage | null> {
    const result = await db
        .select({
            id: suppliers.id,
            nameEn: suppliers.nameEn,
            nameAr: suppliers.nameAr,
            logoImageId: suppliers.logoImageId,
            createdAt: suppliers.createdAt,
            updatedAt: suppliers.updatedAt,
            logoImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(suppliers)
        .leftJoin(images, eq(suppliers.logoImageId, images.id))
        .where(eq(suppliers.id, id))
        .limit(1);

    if (result.length === 0) return null;

    return {
        ...result[0],
        logoImage: result[0].logoImage?.id ? result[0].logoImage : null,
    };
}

export async function createSupplier(data: {
    nameEn: string;
    nameAr: string;
    logoImageId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(suppliers).values({
            id,
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            logoImageId: data.logoImageId || null,
        });
        return { success: true, message: "Supplier created", id };
    } catch (error) {
        console.error("Error creating supplier:", error);
        return { success: false, message: "Failed to create supplier" };
    }
}

export async function updateSupplier(
    id: string,
    data: {
        nameEn: string;
        nameAr: string;
        logoImageId?: string | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(suppliers)
            .set({
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                logoImageId: data.logoImageId || null,
            })
            .where(eq(suppliers.id, id));
        return { success: true, message: "Supplier updated" };
    } catch (error) {
        console.error("Error updating supplier:", error);
        return { success: false, message: "Failed to update supplier" };
    }
}

export async function deleteSupplier(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(suppliers).where(eq(suppliers.id, id));
        return { success: true, message: "Supplier deleted" };
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return { success: false, message: "Failed to delete supplier" };
    }
}
