"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import type { ContactInfo, CompanyProfileWithImages } from "@/actions/website-info";
import { Mail, Phone, MessageCircle, Send, Loader2, User, Building2, FileText } from "lucide-react";

interface ContactContentProps {
    contactInfo: ContactInfo[];
    companyProfile: CompanyProfileWithImages | null;
    locale: string;
}

interface FormState {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

type ContactType = "email" | "phone" | "whatsapp";

const contactIcons: Record<ContactType, React.ReactNode> = {
    email: <Mail className="w-5 h-5" />,
    phone: <Phone className="w-5 h-5" />,
    whatsapp: <MessageCircle className="w-5 h-5" />,
};

const contactColors: Record<ContactType, string> = {
    email: "var(--contact-email)",
    phone: "var(--contact-phone)",
    whatsapp: "var(--contact-whatsapp)",
};

export function ContactContent({ contactInfo, companyProfile, locale }: ContactContentProps) {
    const isArabic = locale === "ar";
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<FormState>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );

            // Buttons animation
            if (buttonsRef.current) {
                gsap.fromTo(
                    buttonsRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
                );
            }

            // Form animation
            gsap.fromTo(
                formRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
            );
        });

        return () => ctx.revert();
    }, []);

    // Group contact info by type
    const groupedContacts = contactInfo.reduce<Record<ContactType, ContactInfo[]>>((acc, info) => {
        const type = info.type as ContactType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(info);
        return acc;
    }, {} as Record<ContactType, ContactInfo[]>);

    const handleInputChange = (field: keyof FormState, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setSubmitStatus("idle");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setSubmitStatus("error");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate form submission - in production, replace with actual endpoint
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitStatus("success");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getContactLink = (type: ContactType, value: string): string => {
        switch (type) {
            case "email":
                return `mailto:${value}`;
            case "phone":
                return `tel:${value}`;
            case "whatsapp":
                return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
            default:
                return "#";
        }
    };

    return (
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Left side - Contact Info */}
                <div>
                    <div ref={headerRef} style={{ opacity: 0 }}>
                        {/* Label */}
                        <span
                            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
                            style={{ color: "var(--contact-accent)" }}
                        >
                            {isArabic ? "تواصل معنا" : "Get In Touch"}
                        </span>

                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {isArabic ? "نحن هنا لمساعدتك" : "Let's Work Together"}
                        </h2>

                        {/* Description */}
                        <p className="text-lg text-white/70 max-w-md mb-8">
                            {isArabic
                                ? "لأي استفسار أو طلب عرض سعر، تواصل معنا عبر أي من وسائل التواصل التالية"
                                : "For inquiries or quotes, reach out through any of our contact channels"
                            }
                        </p>
                    </div>

                    {/* Quick Contact Buttons */}
                    <div ref={buttonsRef} className="flex flex-wrap gap-4">
                        {(Object.keys(contactIcons) as ContactType[]).map((type) => {
                            const contacts = groupedContacts[type];
                            if (!contacts || contacts.length === 0) return null;

                            const primaryContact = contacts[0];
                            const color = contactColors[type];
                            const icon = contactIcons[type];

                            return (
                                <a
                                    key={type}
                                    href={getContactLink(type, primaryContact.value)}
                                    target={type === "whatsapp" ? "_blank" : undefined}
                                    rel={type === "whatsapp" ? "noopener noreferrer" : undefined}
                                    className="group flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    style={{
                                        backgroundColor: `color-mix(in oklch, ${color} 20%, transparent)`,
                                        border: `2px solid color-mix(in oklch, ${color} 40%, transparent)`,
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: color }}
                                    >
                                        {icon}
                                    </div>
                                    <div>
                                        <span className="block text-xs text-white/60 uppercase tracking-wider">
                                            {isArabic ? primaryContact.labelAr : primaryContact.labelEn || type}
                                        </span>
                                        <span className="block text-white font-semibold" dir="ltr">
                                            {primaryContact.value}
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>

                    {/* Company info */}
                    {companyProfile && (
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-2">
                                {isArabic ? companyProfile.nameAr : companyProfile.nameEn}
                            </h3>
                            {companyProfile.taglineEn && (
                                <p className="text-white/60">
                                    {isArabic ? companyProfile.taglineAr : companyProfile.taglineEn}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right side - Contact Form */}
                <div
                    ref={formRef}
                    className="rounded-3xl p-8 md:p-10"
                    style={{
                        backgroundColor: "var(--contact-card-bg)",
                        opacity: 0,
                    }}
                >
                    <h3 className="text-2xl font-bold text-white mb-6">
                        {isArabic ? "أرسل لنا رسالة" : "Send a Message"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 rtl:left-auto rtl:right-4" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder={isArabic ? "الاسم *" : "Name *"}
                                    required
                                    className="w-full h-14 pl-12 pr-4 rtl:pl-4 rtl:pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 rtl:left-auto rtl:right-4" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder={isArabic ? "البريد الإلكتروني *" : "Email *"}
                                    required
                                    dir="ltr"
                                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 rtl:left-auto rtl:right-4" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder={isArabic ? "رقم الهاتف" : "Phone Number"}
                                dir="ltr"
                                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Subject */}
                        <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 rtl:left-auto rtl:right-4" />
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => handleInputChange("subject", e.target.value)}
                                placeholder={isArabic ? "الموضوع" : "Subject"}
                                className="w-full h-14 pl-12 pr-4 rtl:pl-4 rtl:pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Message */}
                        <div className="relative">
                            <Building2 className="absolute left-4 top-5 w-5 h-5 text-white/40 rtl:left-auto rtl:right-4" />
                            <textarea
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                placeholder={isArabic ? "رسالتك *" : "Your Message *"}
                                required
                                rows={4}
                                className="w-full pl-12 pr-4 py-4 rtl:pl-4 rtl:pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isArabic ? "جاري الإرسال..." : "Sending..."}
                                </>
                            ) : (
                                <>
                                    <Send className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
                                    {isArabic ? "إرسال الرسالة" : "Send Message"}
                                </>
                            )}
                        </button>

                        {/* Status Messages */}
                        {submitStatus === "success" && (
                            <p className="text-center text-sm" style={{ color: "var(--contact-whatsapp)" }}>
                                {isArabic ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"}
                            </p>
                        )}
                        {submitStatus === "error" && (
                            <p className="text-center text-sm text-destructive">
                                {isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields"}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
