"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getItems, type Item } from "@/actions/items";
import { Loader2, Package } from "lucide-react";

type ItemsLoadMoreProps = {
    initialItems: Item[];
    initialHasMore: boolean;
};

/**
 * Example Load More component demonstrating the pattern for:
 * - Client-side pagination
 * - Using server actions
 * - Internationalization with next-intl
 * - Loading states with useTransition
 */
export default function ItemsLoadMore({
    initialItems,
    initialHasMore,
}: ItemsLoadMoreProps) {
    const t = useTranslations("dashboard.itemsPage");
    const locale = useLocale();

    const [items, setItems] = useState<Item[]>(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isPending, startTransition] = useTransition();

    const loadMore = () => {
        startTransition(async () => {
            const nextPage = page + 1;
            const result = await getItems(nextPage, 15);
            // Filter out any duplicates based on id
            const existingIds = new Set(items.map((i) => i.id));
            const newItems = result.items.filter((i) => !existingIds.has(i.id));
            setItems((prev) => [...prev, ...newItems]);
            setPage(nextPage);
            setHasMore(result.hasMore);
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
                {t("noItems")}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Items Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">
                                {locale === "ar" ? item.nameAr : item.nameEn}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center">
                    <Button
                        onClick={loadMore}
                        disabled={isPending}
                        variant="outline"
                        className="min-w-[140px]"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("loading")}
                            </>
                        ) : (
                            t("loadMore")
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
