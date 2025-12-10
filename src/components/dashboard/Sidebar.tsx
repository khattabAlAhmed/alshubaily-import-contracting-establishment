'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { Logout } from '../logout';

const Sidebar = () => {
    const t = useTranslations('dashboard.sidebar');
    const pathname = usePathname();

    // Add more navigation items as needed
    const links = [
        { href: '/dashboard', label: t('home'), icon: LayoutDashboard },
    ];

    return (
        <aside className="w-full md:w-64 bg-background border-r min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6 px-4">{t("title")}</h2>
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Button
                                key={link.href}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", isActive && "bg-muted")}
                                asChild
                            >
                                <Link href={link.href}>
                                    <Icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                    {link.label}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </div>
            <Separator />
            <Logout />
        </aside>
    );
};

export default Sidebar;
