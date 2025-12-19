"use server";

import { db } from "@/lib/db/drizzle";
import { images } from "@/lib/db/schema/images-schema";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export type ImageRecord = {
    id: string;
    url: string;
    titleEn: string | null;
    titleAr: string | null;
    altEn: string | null;
    altAr: string | null;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Get all images
 */
export async function getAllImages(): Promise<ImageRecord[]> {
    const result = await db.select().from(images).orderBy(images.createdAt);
    return result;
}

/**
 * Get a single image by ID
 */
export async function getImageById(id: string): Promise<ImageRecord | null> {
    const result = await db
        .select()
        .from(images)
        .where(eq(images.id, id))
        .limit(1);

    return result[0] || null;
}

/**
 * Upload image to Supabase Storage and save record to database
 */
export async function uploadImage(
    formData: FormData
): Promise<{ success: boolean; message: string; image?: ImageRecord }> {
    try {
        const file = formData.get("file") as File;
        const titleEn = formData.get("titleEn") as string | null;
        const titleAr = formData.get("titleAr") as string | null;
        const altEn = formData.get("altEn") as string | null;
        const altAr = formData.get("altAr") as string | null;

        if (!file) {
            return { success: false, message: "No file provided" };
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return { success: false, message: "File must be an image" };
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return { success: false, message: "File size must be less than 5MB" };
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${nanoid()}.${ext}`;

        // Upload to Supabase Storage
        const supabase = await createClient();
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("images")
            .upload(filename, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, message: uploadError.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("images")
            .getPublicUrl(uploadData.path);

        const publicUrl = urlData.publicUrl;

        // Save to database
        const imageId = nanoid();
        const newImage = {
            id: imageId,
            url: publicUrl,
            titleEn: titleEn || null,
            titleAr: titleAr || null,
            altEn: altEn || null,
            altAr: altAr || null,
        };

        await db.insert(images).values(newImage);

        // Fetch the created image
        const createdImage = await getImageById(imageId);

        return {
            success: true,
            message: "Image uploaded successfully",
            image: createdImage || undefined,
        };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, message: "Failed to upload image" };
    }
}

/**
 * Update image metadata
 */
export async function updateImage(
    id: string,
    data: {
        titleEn?: string | null;
        titleAr?: string | null;
        altEn?: string | null;
        altAr?: string | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(images).set(data).where(eq(images.id, id));
        return { success: true, message: "Image updated successfully" };
    } catch (error) {
        console.error("Error updating image:", error);
        return { success: false, message: "Failed to update image" };
    }
}

/**
 * Delete image from storage and database
 */
export async function deleteImage(
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Get image first
        const image = await getImageById(id);
        if (!image) {
            return { success: false, message: "Image not found" };
        }

        // Extract filename from URL
        const urlParts = image.url.split("/");
        const filename = urlParts[urlParts.length - 1];

        // Delete from Supabase Storage
        const supabase = await createClient();
        const { error: deleteError } = await supabase.storage
            .from("images")
            .remove([filename]);

        if (deleteError) {
            console.error("Storage delete error:", deleteError);
            // Continue to delete from database anyway
        }

        // Delete from database
        await db.delete(images).where(eq(images.id, id));

        return { success: true, message: "Image deleted successfully" };
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false, message: "Failed to delete image" };
    }
}
