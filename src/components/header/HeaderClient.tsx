"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
    Menu,
    X,
    Search,
    ChevronDown,
    Phone,
    Globe,
    Sun,
    Moon,
    Building2,
    Package,
    ArrowRight
} from "lucide-react";
import { useTheme } from "next-themes";
import type { HeaderData, HeaderServiceData } from "@/actions/header";

interface HeaderClientProps {
    data: HeaderData;
}

export function HeaderClient({ data }: HeaderClientProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const isArabic = locale === "ar";

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const headerRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Close dropdown on route change
        setActiveDropdown(null);
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        // Click outside handler for dropdown
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const switchLocale = () => {
        const newLocale = locale === "ar" ? "en" : "ar";
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    const getServiceSubItems = (mainServiceId: string): Array<{ id: string; titleEn: string; titleAr: string; slugEn: string; slugAr: string }> => {
        const isImport = mainServiceId === "service_import";
        const isContracting = mainServiceId === "service_contracting";

        if (isImport) {
            return data.services.importServices.filter(s => s.mainServiceId === mainServiceId);
        }
        if (isContracting) {
            return data.services.contractingServices.filter(s => s.mainServiceId === mainServiceId);
        }
        return [];
    };

    const getServiceIcon = (id: string) => {
        if (id === "service_import") return <Package className="w-5 h-5" />;
        if (id === "service_contracting") return <Building2 className="w-5 h-5" />;
        return null;
    };

    const companyName = data.companyName
        ? (isArabic ? data.companyName.ar : data.companyName.en)
        : isArabic ? "مؤسسة الشبيلي" : "Alshubaily Est.";

    return (
        <>
            <header
                ref={headerRef}
                className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href={`/${locale}`} className="flex items-center gap-3 group">
                            {data.logoUrl ? (
                                <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-xl overflow-hidden transition-transform group-hover:scale-105">
                                    <Image
                                        src={data.logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg transition-transform group-hover:scale-105">
                                    ش
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <span className="text-lg md:text-xl font-bold text-foreground">
                                    {companyName}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
                            {/* Home */}
                            <Link
                                href={`/${locale}`}
                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
                            >
                                {isArabic ? "الرئيسية" : "Home"}
                            </Link>

                            {/* Services Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
                                    onMouseEnter={() => setActiveDropdown("services")}
                                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-accent ${activeDropdown === "services" ? "text-primary bg-accent" : "text-foreground/80 hover:text-primary"
                                        }`}
                                >
                                    {isArabic ? "خدماتنا" : "Services"}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "services" ? "rotate-180" : ""}`} />
                                </button>

                                {/* Mega Menu */}
                                {activeDropdown === "services" && (
                                    <div
                                        className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl p-6 min-w-[500px]"
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        <div className="grid grid-cols-2 gap-6">
                                            {data.services.mainServices.map((mainService) => {
                                                const subItems = getServiceSubItems(mainService.id);
                                                const icon = getServiceIcon(mainService.id);

                                                return (
                                                    <div key={mainService.id} className="space-y-3">
                                                        {/* Main Service Header */}
                                                        <Link
                                                            href={`/${locale}/services/${isArabic ? mainService.slugAr : mainService.slugEn}`}
                                                            className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                {icon}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-foreground block">
                                                                    {isArabic ? mainService.titleAr : mainService.titleEn}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {subItems.length} {isArabic ? "خدمات فرعية" : "sub-services"}
                                                                </span>
                                                            </div>
                                                        </Link>

                                                        {/* Sub Services */}
                                                        <div className="space-y-1 ps-4 border-s-2 border-border">
                                                            {subItems.slice(0, 5).map((sub) => (
                                                                <Link
                                                                    key={sub.id}
                                                                    href={`/${locale}/services/${isArabic ? mainService.slugAr : mainService.slugEn}/${isArabic ? sub.slugAr : sub.slugEn}`}
                                                                    className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {isArabic ? sub.titleAr : sub.titleEn}
                                                                </Link>
                                                            ))}
                                                            {subItems.length > 5 && (
                                                                <Link
                                                                    href={`/${locale}/services/${isArabic ? mainService.slugAr : mainService.slugEn}`}
                                                                    className="flex items-center gap-1 py-1.5 text-sm text-primary font-medium"
                                                                >
                                                                    {isArabic ? "عرض الكل" : "View all"}
                                                                    <ArrowRight className={`w-3 h-3 ${isArabic ? "rotate-180" : ""}`} />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Projects */}
                            <Link
                                href={`/${locale}/projects`}
                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
                            >
                                {isArabic ? "المشاريع" : "Projects"}
                            </Link>

                            {/* About */}
                            <Link
                                href={`/${locale}/about`}
                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
                            >
                                {isArabic ? "من نحن" : "About"}
                            </Link>

                            {/* Contact */}
                            <Link
                                href={`/${locale}/contact`}
                                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
                            >
                                {isArabic ? "تواصل معنا" : "Contact"}
                            </Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2.5 rounded-xl hover:bg-accent transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 text-foreground/70" />
                            </button>

                            {/* Language Switch */}
                            <button
                                onClick={switchLocale}
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-sm font-medium text-foreground/70"
                            >
                                <Globe className="w-4 h-4" />
                                {locale === "ar" ? "EN" : "عربي"}
                            </button>

                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2.5 rounded-xl hover:bg-accent transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === "dark" ? (
                                        <Sun className="w-5 h-5 text-foreground/70" />
                                    ) : (
                                        <Moon className="w-5 h-5 text-foreground/70" />
                                    )}
                                </button>
                            )}

                            {/* Phone CTA */}
                            {data.primaryPhone && (
                                <a
                                    href={`tel:${data.primaryPhone}`}
                                    className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span dir="ltr">{data.primaryPhone}</span>
                                </a>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl hover:bg-accent transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute inset-y-0 end-0 w-full max-w-sm bg-background shadow-xl overflow-y-auto">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <span className="font-bold text-lg">{isArabic ? "القائمة" : "Menu"}</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-accent"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Nav */}
                        <nav className="p-4 space-y-2">
                            <Link
                                href={`/${locale}`}
                                className="block px-4 py-3 rounded-xl hover:bg-accent font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {isArabic ? "الرئيسية" : "Home"}
                            </Link>

                            {/* Services */}
                            <div className="space-y-2">
                                <span className="block px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    {isArabic ? "خدماتنا" : "Services"}
                                </span>
                                {data.services.mainServices.map((mainService) => {
                                    const subItems = getServiceSubItems(mainService.id);
                                    return (
                                        <div key={mainService.id} className="ps-4">
                                            <Link
                                                href={`/${locale}/services/${isArabic ? mainService.slugAr : mainService.slugEn}`}
                                                className="block px-4 py-2 rounded-lg bg-accent/50 font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {isArabic ? mainService.titleAr : mainService.titleEn}
                                            </Link>
                                            <div className="ps-4 mt-1 space-y-1">
                                                {subItems.slice(0, 4).map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/${locale}/services/${isArabic ? mainService.slugAr : mainService.slugEn}/${isArabic ? sub.slugAr : sub.slugEn}`}
                                                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {isArabic ? sub.titleAr : sub.titleEn}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link
                                href={`/${locale}/projects`}
                                className="block px-4 py-3 rounded-xl hover:bg-accent font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {isArabic ? "المشاريع" : "Projects"}
                            </Link>

                            <Link
                                href={`/${locale}/about`}
                                className="block px-4 py-3 rounded-xl hover:bg-accent font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {isArabic ? "من نحن" : "About"}
                            </Link>

                            <Link
                                href={`/${locale}/contact`}
                                className="block px-4 py-3 rounded-xl hover:bg-accent font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {isArabic ? "تواصل معنا" : "Contact"}
                            </Link>
                        </nav>

                        {/* Mobile Footer Actions */}
                        <div className="p-4 border-t border-border space-y-3">
                            <button
                                onClick={() => {
                                    switchLocale();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-accent"
                            >
                                <Globe className="w-5 h-5" />
                                {locale === "ar" ? "English" : "العربية"}
                            </button>

                            {data.primaryPhone && (
                                <a
                                    href={`tel:${data.primaryPhone}`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span dir="ltr">{data.primaryPhone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Search Dialog */}
            {searchOpen && (
                <SearchDialog
                    isOpen={searchOpen}
                    onClose={() => setSearchOpen(false)}
                    locale={locale}
                />
            )}
        </>
    );
}

// Search Dialog Component
interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

function SearchDialog({ isOpen, onClose, locale }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isArabic = locale === "ar";

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    useEffect(() => {
        const searchDebounce = setTimeout(async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchDebounce);
    }, [query, locale]);

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative max-w-2xl mx-auto mt-20 md:mt-32 mx-4">
                <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isArabic ? "ابحث في الموقع..." : "Search the site..."}
                            className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                        />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-accent"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading && (
                            <div className="p-8 text-center text-muted-foreground">
                                {isArabic ? "جاري البحث..." : "Searching..."}
                            </div>
                        )}

                        {!loading && query.length >= 2 && results.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                {isArabic ? "لا توجد نتائج" : "No results found"}
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="p-2">
                                {results.map((result, idx) => (
                                    <Link
                                        key={`${result.type}-${result.id}-${idx}`}
                                        href={result.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                            {result.type.slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-medium truncate">{result.title}</span>
                                            <span className="block text-xs text-muted-foreground capitalize">{result.type}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && query.length < 2 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                {isArabic ? "اكتب كلمتين على الأقل للبحث" : "Type at least 2 characters to search"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SearchResult {
    id: string;
    type: string;
    title: string;
    href: string;
}
