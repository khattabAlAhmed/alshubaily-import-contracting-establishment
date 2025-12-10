"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type SelectOption = {
    value: string;
    labelEn: string;
    labelAr: string;
};

type SearchableSelectProps = {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    locale: string;
    disabled?: boolean;
    className?: string;
};

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    emptyText,
    locale,
    disabled = false,
    className,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedLabel = selectedOption
        ? locale === "ar"
            ? selectedOption.labelAr
            : selectedOption.labelEn
        : placeholder;

    const filteredOptions = options.filter((opt) => {
        const searchLower = search.toLowerCase();
        return (
            opt.labelEn.toLowerCase().includes(searchLower) ||
            opt.labelAr.includes(search)
        );
    });

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className="w-full justify-between font-normal"
                onClick={() => setOpen(!open)}
            >
                <span className={cn(!value && "text-muted-foreground")}>
                    {selectedLabel}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="max-h-60 overflow-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {emptyText}
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                        value === opt.value && "bg-accent"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === opt.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {locale === "ar" ? opt.labelAr : opt.labelEn}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
