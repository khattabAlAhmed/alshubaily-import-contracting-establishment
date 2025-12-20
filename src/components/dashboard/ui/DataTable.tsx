"use client";

import { useLocale, useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export type Column<T> = {
    key: keyof T | string;
    labelEn: string;
    labelAr: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
};

export type DataTableAction<T> = {
    type: "view" | "edit" | "delete" | "custom";
    labelEn: string;
    labelAr: string;
    href?: (item: T) => string;
    onClick?: (item: T) => void;
    icon?: React.ReactNode;
    show?: (item: T) => boolean;
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    actions?: DataTableAction<T>[];
    isLoading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessageEn?: string;
    emptyMessageAr?: string;
    getRowId: (item: T) => string;
};

export function DataTable<T>({
    data,
    columns,
    actions,
    isLoading = false,
    searchable = false,
    searchPlaceholder = "Search...",
    emptyMessageEn = "No items found",
    emptyMessageAr = "لا توجد عناصر",
    getRowId,
}: DataTableProps<T>) {
    const locale = useLocale();
    const [search, setSearch] = useState("");

    const filteredData = searchable && search.trim() !== ""
        ? data.filter((item) => {
            const searchLower = search.toLowerCase();
            // Search through rendered column values or direct string properties
            return columns.some((col) => {
                // Try direct property access first
                const value = (item as Record<string, unknown>)[col.key as string];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchLower);
                }
                // For nested properties, try common patterns
                const keyStr = col.key as string;
                if (keyStr === "title") {
                    const item_ = item as { titleEn?: string; titleAr?: string };
                    return (item_.titleEn?.toLowerCase().includes(searchLower) ||
                        item_.titleAr?.toLowerCase().includes(searchLower));
                }
                return false;
            });
        })
        : data;

    const emptyMessage = locale === "ar" ? emptyMessageAr : emptyMessageEn;

    const getActionIcon = (type: DataTableAction<T>["type"]) => {
        switch (type) {
            case "view": return <Eye className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />;
            case "edit": return <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />;
            case "delete": return <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />;
            default: return null;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {searchable && <Skeleton className="h-10 w-full max-w-sm" />}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead key={col.key as string}>
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                ))}
                                {actions && <TableHead><Skeleton className="h-4 w-10" /></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key as string}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                    {actions && <TableCell><Skeleton className="h-8 w-8" /></TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {searchable && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rtl:pl-3 rtl:pr-9"
                    />
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key as string} className={col.className}>
                                    {locale === "ar" ? col.labelAr : col.labelEn}
                                </TableHead>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableHead className="w-[70px]"></TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={getRowId(item)}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key as string} className={col.className}>
                                            {col.render
                                                ? col.render(item)
                                                : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                                        </TableCell>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {actions
                                                        .filter((action) => !action.show || action.show(item))
                                                        .map((action, idx) => {
                                                            const label = locale === "ar" ? action.labelAr : action.labelEn;
                                                            const icon = action.icon || getActionIcon(action.type);

                                                            if (action.href) {
                                                                return (
                                                                    <DropdownMenuItem key={idx} asChild>
                                                                        <Link href={action.href(item)}>
                                                                            {icon}
                                                                            {label}
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                );
                                                            }

                                                            return (
                                                                <DropdownMenuItem
                                                                    key={idx}
                                                                    onClick={() => action.onClick?.(item)}
                                                                    className={action.type === "delete" ? "text-destructive" : ""}
                                                                >
                                                                    {icon}
                                                                    {label}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
