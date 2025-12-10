"use server";

import { db } from "@/lib/db/drizzle";
import { item } from "@/lib/db/schema/academy-schema";

// Type definitions for your items
export type Item = {
    id: string;
    nameEn: string;
    nameAr: string;
    createdAt: Date;
};

export type GetItemsResult = {
    items: Item[];
    hasMore: boolean;
};

/**
 * Example server action for fetching items with pagination
 * This demonstrates the pattern for creating paginated data fetching actions
 */
export async function getItems(
    page: number = 1,
    limit: number = 15
): Promise<GetItemsResult> {
    const offset = (page - 1) * limit;

    const result = await db
        .select()
        .from(item)
        .limit(limit + 1)
        .offset(offset);

    const hasMore = result.length > limit;
    const items = (hasMore ? result.slice(0, limit) : result) as Item[];

    return { items, hasMore };
}
