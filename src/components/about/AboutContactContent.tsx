"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaXTwitter, FaTiktok } from "react-icons/fa6";
import type { ContactInfo, SocialMediaAccount } from "@/actions/website-info";

gsap.registerPlugin(ScrollTrigger);

interface AboutContactContentProps {
    contactInfo: ContactInfo[];
    companyName: string | null;
    socialMedia: SocialMediaAccount[];
    locale: string;
}

const socialIcons: Record<string, React.ReactNode> = {
    facebook: <FaFacebook className="w-5 h-5" />,
    instagram: <FaInstagram className="w-5 h-5" />,
    linkedin: <FaLinkedin className="w-5 h-5" />,
    youtube: <FaYoutube className="w-5 h-5" />,
    twitter: <FaXTwitter className="w-5 h-5" />,
    whatsapp: <FaWhatsapp className="w-5 h-5" />,
    tiktok: <FaTiktok className="w-5 h-5" />,
};

export function AboutContactContent({
    contactInfo,
    companyName,
    socialMedia,
    locale,
}: AboutContactContentProps) {
    const isArabic = locale === "ar";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".contact-item",
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                ".map-container",
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const phones = contactInfo.filter((c) => c.type === "phone");
    const whatsapps = contactInfo.filter((c) => c.type === "whatsapp");
    const emails = contactInfo.filter((c) => c.type === "email");

    // Jeddah, Saudi Arabia coordinates
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237869.36956492943!2d38.99944225!3d21.485810700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0x5d7a5c4c8b2f6c8!2sJeddah%2C%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1703952000000!5m2!1sen!2s";

    return (
        <div ref={containerRef} className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Contact Info */}
                <div>
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {isArabic ? "تواصل معنا" : "Get in Touch"}
                        </h2>
                        <p className="text-white/70 text-lg">
                            {isArabic
                                ? "نحن هنا للإجابة على استفساراتكم"
                                : "We're here to answer your questions"
                            }
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="space-y-4">
                        {/* Phone */}
                        {phones.map((phone) => (
                            <a
                                key={phone.id}
                                href={`tel:${phone.value}`}
                                className="contact-item flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                                style={{ backgroundColor: "var(--contact-card-bg)" }}
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "color-mix(in oklch, var(--contact-phone) 20%, transparent)" }}
                                >
                                    <Phone className="w-6 h-6" style={{ color: "var(--contact-phone)" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/60 text-sm mb-1">
                                        {isArabic ? phone.labelAr || "هاتف" : phone.labelEn || "Phone"}
                                    </p>
                                    <p className="text-white font-semibold text-lg" dir="ltr">
                                        {phone.value}
                                    </p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}

                        {/* WhatsApp */}
                        {whatsapps.map((wa) => (
                            <a
                                key={wa.id}
                                href={`https://wa.me/${wa.value.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-item flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                                style={{ backgroundColor: "var(--contact-card-bg)" }}
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "color-mix(in oklch, var(--contact-whatsapp) 20%, transparent)" }}
                                >
                                    <FaWhatsapp className="w-6 h-6" style={{ color: "var(--contact-whatsapp)" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/60 text-sm mb-1">
                                        {isArabic ? wa.labelAr || "واتساب" : wa.labelEn || "WhatsApp"}
                                    </p>
                                    <p className="text-white font-semibold text-lg" dir="ltr">
                                        {wa.value}
                                    </p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}

                        {/* Email */}
                        {emails.map((email) => (
                            <a
                                key={email.id}
                                href={`mailto:${email.value}`}
                                className="contact-item flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                                style={{ backgroundColor: "var(--contact-card-bg)" }}
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "color-mix(in oklch, var(--contact-email) 20%, transparent)" }}
                                >
                                    <Mail className="w-6 h-6" style={{ color: "var(--contact-email)" }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/60 text-sm mb-1">
                                        {isArabic ? email.labelAr || "البريد الإلكتروني" : email.labelEn || "Email"}
                                    </p>
                                    <p className="text-white font-semibold text-lg truncate">
                                        {email.value}
                                    </p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}

                        {/* Location */}
                        <div
                            className="contact-item flex items-center gap-4 p-5 rounded-2xl"
                            style={{ backgroundColor: "var(--contact-card-bg)" }}
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: "color-mix(in oklch, var(--contact-accent) 20%, transparent)" }}
                            >
                                <MapPin className="w-6 h-6" style={{ color: "var(--contact-accent)" }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white/60 text-sm mb-1">
                                    {isArabic ? "العنوان" : "Address"}
                                </p>
                                <p className="text-white font-semibold">
                                    {isArabic ? "جدة، المملكة العربية السعودية" : "Jeddah, Saudi Arabia"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    {socialMedia.length > 0 && (
                        <div className="mt-8">
                            <p className="text-white/60 text-sm mb-4">
                                {isArabic ? "تابعنا على" : "Follow us on"}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {socialMedia.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                                        style={{ backgroundColor: "var(--contact-card-bg)" }}
                                        aria-label={social.platform}
                                    >
                                        {socialIcons[social.platform.toLowerCase()] || <MessageCircle className="w-5 h-5" />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Map */}
                <div className="map-container relative">
                    <div className="sticky top-24">
                        <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                            <iframe
                                src={mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={isArabic ? "موقعنا على الخريطة" : "Our location on the map"}
                            />
                        </div>

                        {/* Company name overlay */}
                        <div
                            className="absolute bottom-4 start-4 end-4 p-4 rounded-2xl backdrop-blur-md"
                            style={{ backgroundColor: "var(--contact-card-bg)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        {companyName || (isArabic ? "مؤسسة الشبيلي" : "Alshubaily Est.")}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        {isArabic ? "جدة، المملكة العربية السعودية" : "Jeddah, Saudi Arabia"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
