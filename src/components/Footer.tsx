'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
    Youtube,
    Linkedin,
    Instagram,
    Facebook,
} from 'lucide-react';
import { FaTelegram, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    const t = useTranslations('Footer');
    const navItems = useTranslations('navItems');

    const socialLinks = [
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', isLucide: true },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', isLucide: true },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', isLucide: true },
        { icon: FaTelegram, href: 'https://t.me/', label: 'Telegram', isLucide: false },
        { icon: FaWhatsapp, href: 'https://wa.me/', label: 'WhatsApp', isLucide: false },
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', isLucide: true },
        { icon: FaXTwitter, href: 'https://twitter.com', label: 'X (Twitter)', isLucide: false },
    ];

    const sitemapLinks = [
        { label: navItems('home'), href: '/' },
        { label: navItems('about'), href: '/about' },
        { label: navItems('contact'), href: '/contact' },
    ];

    return (
        <footer className="bg-[#0b8eca] text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Social Media Icons */}
                <div className="flex justify-center gap-4 mb-12 pb-8 border-b border-white/20 flex-row items-center">
                    <div className='h-1 bg-white w-30 z-20'></div>

                    {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                            <Link
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label={social.label}
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        );
                    })}
                    <div className='h-1 bg-white w-30 z-20'></div>
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                    {/* Quick Links */}
                    <div className="text-center md:text-start">
                        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-white/20">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {sitemapLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:underline hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-transform duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="text-center md:text-start">
                        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-white/20">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm hover:underline hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-transform duration-200"
                                >
                                    {t('bottomLinks.privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm hover:underline hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-transform duration-200"
                                >
                                    {t('bottomLinks.terms')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/20">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <p className="text-sm">
                            {t('copyright')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
