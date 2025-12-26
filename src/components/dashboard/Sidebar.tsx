'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    Users,
    Shield,
    Image,
    FolderKanban,
    FileText,
    Handshake,
    Truck,
    MessageSquareQuote,
    Package,
    Wrench,
    ChevronDown,
    ChevronRight,
    Globe,
    Film,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { Logout } from '../logout';
import { useState } from 'react';

type NavItem = {
    href: string;
    labelKey: string;
    icon: React.ElementType;
    permission?: string;
};

type NavGroup = {
    titleKey: string;
    items: NavItem[];
    collapsible?: boolean;
};

const navGroups: NavGroup[] = [
    {
        titleKey: "main",
        items: [
            { href: '/dashboard', labelKey: 'home', icon: LayoutDashboard },
        ],
    },
    {
        titleKey: "users",
        collapsible: true,
        items: [
            { href: '/dashboard/users', labelKey: 'users', icon: Users, permission: 'accounts.view' },
            { href: '/dashboard/roles', labelKey: 'roles', icon: Shield, permission: 'roles.view' },
        ],
    },
    {
        titleKey: "media",
        collapsible: true,
        items: [
            { href: '/dashboard/media', labelKey: 'images', icon: Image, permission: 'images.view' },
        ],
    },
    {
        titleKey: "content",
        collapsible: true,
        items: [
            { href: '/dashboard/hero-carousel', labelKey: 'heroCarousel', icon: Film, permission: 'hero.view' },
            { href: '/dashboard/projects', labelKey: 'projects', icon: FolderKanban, permission: 'projects.view' },
            { href: '/dashboard/articles', labelKey: 'articles', icon: FileText, permission: 'articles.view' },
            { href: '/dashboard/partners', labelKey: 'partners', icon: Handshake, permission: 'partners.view' },
            { href: '/dashboard/suppliers', labelKey: 'suppliers', icon: Truck, permission: 'suppliers.view' },
            { href: '/dashboard/faqs', labelKey: 'faqs', icon: MessageSquareQuote, permission: 'faqs.view' },
            { href: '/dashboard/website-info', labelKey: 'websiteInfo', icon: Globe, permission: 'website.view' },
        ],
    },
    {
        titleKey: "catalog",
        collapsible: true,
        items: [
            { href: '/dashboard/products', labelKey: 'products', icon: Package, permission: 'products.view' },
            { href: '/dashboard/services', labelKey: 'services', icon: Wrench, permission: 'services.view' },
        ],
    },
];

const Sidebar = () => {
    const t = useTranslations('dashboard.sidebar');
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        users: true,
        media: true,
        content: true,
        catalog: true,
    });

    const toggleGroup = (groupKey: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    const isActive = (href: string) => {
        // Remove locale prefix for comparison
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
        return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');
    };

    return (
        <aside className="w-full md:w-64 bg-background border-r min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6 px-4">{t("title")}</h2>
                <nav className="space-y-1">
                    {navGroups.map((group) => (
                        <div key={group.titleKey} className="space-y-1">
                            {group.collapsible ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-between text-muted-foreground hover:text-foreground px-4 h-8"
                                        onClick={() => toggleGroup(group.titleKey)}
                                    >
                                        <span className="text-xs font-medium uppercase tracking-wider">
                                            {t(group.titleKey)}
                                        </span>
                                        {expandedGroups[group.titleKey] ? (
                                            <ChevronDown className="h-3 w-3" />
                                        ) : (
                                            <ChevronRight className="h-3 w-3" />
                                        )}
                                    </Button>
                                    {expandedGroups[group.titleKey] && (
                                        <div className="space-y-1 pl-2">
                                            {group.items.map((item) => {
                                                const Icon = item.icon;
                                                const active = isActive(item.href);
                                                return (
                                                    <Button
                                                        key={item.href}
                                                        variant={active ? "secondary" : "ghost"}
                                                        size="sm"
                                                        className={cn("w-full justify-start", active && "bg-muted")}
                                                        asChild
                                                    >
                                                        <Link href={item.href}>
                                                            <Icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                                            {t(item.labelKey)}
                                                        </Link>
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Button
                                            key={item.href}
                                            variant={active ? "secondary" : "ghost"}
                                            className={cn("w-full justify-start", active && "bg-muted")}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                <Icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                                {t(item.labelKey)}
                                            </Link>
                                        </Button>
                                    );
                                })
                            )}
                        </div>
                    ))}
                </nav>
            </div>
            <div className="mt-auto">
                <Separator />
                <Logout />
            </div>
        </aside>
    );
};

export default Sidebar;
