'use client';

import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitch from './LanguageSwitch'
import ModeToggler from './mode-toggler'
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
    const t = useTranslations('HomePage');
    const navItems = useTranslations('navItems');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const locale = useLocale();

    const navItemsList = [
        { label: navItems('home'), href: '/' },
        { label: navItems('about'), href: '/about' },
        { label: navItems('contact'), href: '/contact' },
    ];

    return (
        <>
            {/* Top Language Bar */}
            <div className="bg-[#0b8eca] text-white py-2 px-4">
                <div className="container mx-auto flex justify-end items-center">
                    <LanguageSwitch />
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="container mx-auto">
                    {/* Mobile & Tablet Header */}
                    <div className="flex items-center justify-between py-4 px-4 lg:hidden">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 items-center">
                            <div className="w-auto">
                                <h1 className="text-lg font-bold text-[#0b8eca]">{t('title')}</h1>
                            </div>
                        </Link>

                        <ModeToggler />
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center justify-between py-4 px-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="w-auto">
                                <h1 className="text-xl font-bold text-[#0b8eca]">{t('title')}</h1>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-1 me-auto ms-12">
                            {navItemsList.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block px-4 py-2 text-md font-medium text-foreground hover:text-[#0b8eca] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <ModeToggler />
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute inset-0 bg-[#0b5f7f] text-white overflow-y-auto">
                        {/* Close Button */}
                        <div className="flex justify-start p-4 mt-12">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <nav className="px-6 py-4 space-y-2">
                            {navItemsList.map((item) => (
                                <div key={item.label} className="border-b border-white/20 pb-4">
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-xl py-3 hover:text-white/80 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;