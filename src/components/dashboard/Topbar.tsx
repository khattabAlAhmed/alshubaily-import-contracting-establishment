import React from 'react';
import ModeToggler from '@/components/mode-toggler';
import LanguageSwitch from '@/components/LanguageSwitch';

export default function Topbar() {
    return (
        <header className="border-b bg-background p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="font-semibold text-lg">
                {/* Placeholder for dynamic title or breadcrumb */}
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitch />
                <ModeToggler />
            </div>
        </header>
    );
}
