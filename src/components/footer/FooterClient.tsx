"use client";

import { useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import {
    Phone,
    Mail,
    MapPin,
    ArrowUpRight,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
} from "lucide-react";
import { FaWhatsapp, FaXTwitter, FaTiktok } from "react-icons/fa6";
import type { HeaderData } from "@/actions/header";

interface FooterClientProps {
    data: HeaderData;
    contactInfo: Array<{
        id: string;
        type: string;
        value: string;
        labelEn: string | null;
        labelAr: string | null;
    }>;
    socialLinks: Array<{
        id: string;
        platform: string;
        url: string;
        username: string | null;
    }>;
}

const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    twitter: <FaXTwitter className="w-5 h-5" />,
    whatsapp: <FaWhatsapp className="w-5 h-5" />,
    tiktok: <FaTiktok className="w-5 h-5" />,
};

export function FooterClient({ data, contactInfo, socialLinks }: FooterClientProps) {
    const locale = useLocale();
    const isArabic = locale === "ar";
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".footer-animate",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                    }
                }
            );
        });

        return () => ctx.revert();
    }, []);

    const currentYear = new Date().getFullYear();
    const companyName = data.companyName
        ? (isArabic ? data.companyName.ar : data.companyName.en)
        : isArabic ? "مؤسسة الشبيلي للاستيراد والمقاولات" : "Alshubaily Import & Contracting Est.";

    const primaryEmail = contactInfo.find(c => c.type === "email");
    const primaryPhone = contactInfo.find(c => c.type === "phone");
    const primaryWhatsApp = contactInfo.find(c => c.type === "whatsapp");

    const quickLinks = [
        { labelEn: "Home", labelAr: "الرئيسية", href: `/${locale}` },
        { labelEn: "About Us", labelAr: "من نحن", href: `/${locale}/about` },
        { labelEn: "Projects", labelAr: "المشاريع", href: `/${locale}/projects` },
        { labelEn: "Blog", labelAr: "المدونة", href: `/${locale}/blog` },
        { labelEn: "Contact", labelAr: "تواصل معنا", href: `/${locale}/contact` },
    ];

    const legalLinks = [
        { labelEn: "Privacy Policy", labelAr: "سياسة الخصوصية", href: `/${locale}/privacy` },
        { labelEn: "Terms of Service", labelAr: "شروط الخدمة", href: `/${locale}/terms` },
    ];

    return (
        <footer ref={footerRef} className="bg-foreground text-background">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="footer-animate lg:col-span-1">
                        <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6 group">
                            {data.logoUrl ? (
                                <div className="w-12 h-12 relative rounded-xl overflow-hidden transition-transform group-hover:scale-105">
                                    <Image
                                        src={data.logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl transition-transform group-hover:scale-105">
                                    ش
                                </div>
                            )}
                            <span className="text-xl font-bold">{isArabic ? "الشبيلي" : "Alshubaily"}</span>
                        </Link>
                        <p className="text-background/70 text-sm leading-relaxed mb-6">
                            {isArabic
                                ? "مؤسسة رائدة في مجال الاستيراد والمقاولات، نقدم أفضل الخدمات والمنتجات بجودة عالية."
                                : "A leading establishment in import and contracting, providing the best services and products with high quality."
                            }
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                                    aria-label={social.platform}
                                >
                                    {socialIcons[social.platform.toLowerCase()] || <ArrowUpRight className="w-5 h-5" />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className="footer-animate">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            {isArabic ? "خدماتنا" : "Our Services"}
                        </h3>
                        <ul className="space-y-3">
                            {data.services.mainServices.map((service) => (
                                <li key={service.id}>
                                    <Link
                                        href={`/${locale}/services/${isArabic ? service.slugAr : service.slugEn}`}
                                        className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {isArabic ? service.titleAr : service.titleEn}
                                        <ArrowUpRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isArabic ? "rotate-[225deg]" : ""}`} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className="footer-animate">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            {isArabic ? "روابط سريعة" : "Quick Links"}
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {isArabic ? link.labelAr : link.labelEn}
                                        <ArrowUpRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isArabic ? "rotate-[225deg]" : ""}`} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-animate">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            {isArabic ? "تواصل معنا" : "Contact Info"}
                        </h3>
                        <ul className="space-y-4">
                            {primaryPhone && (
                                <li>
                                    <a
                                        href={`tel:${primaryPhone.value}`}
                                        className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <span dir="ltr">{primaryPhone.value}</span>
                                    </a>
                                </li>
                            )}
                            {primaryWhatsApp && (
                                <li>
                                    <a
                                        href={`https://wa.me/${primaryWhatsApp.value.replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors"
                                    >
                                        <FaWhatsapp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <span dir="ltr">{primaryWhatsApp.value}</span>
                                    </a>
                                </li>
                            )}
                            {primaryEmail && (
                                <li>
                                    <a
                                        href={`mailto:${primaryEmail.value}`}
                                        className="flex items-start gap-3 text-background/70 hover:text-primary transition-colors"
                                    >
                                        <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <span>{primaryEmail.value}</span>
                                    </a>
                                </li>
                            )}
                            <li className="flex items-start gap-3 text-background/70">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>
                                    {isArabic
                                        ? "المملكة العربية السعودية، جدة"
                                        : "Saudi Arabia, Jeddah"
                                    }
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-background/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-background/60">
                            © {currentYear} {companyName}. {isArabic ? "جميع الحقوق محفوظة" : "All rights reserved"}.
                        </p>
                        <div className="flex items-center gap-6">
                            {legalLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="text-sm text-background/60 hover:text-primary transition-colors"
                                >
                                    {isArabic ? link.labelAr : link.labelEn}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
