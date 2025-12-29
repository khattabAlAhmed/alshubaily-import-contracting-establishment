import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};


export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
