import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { hasDashboardAccess } from '@/server/roles';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if user is authenticated
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    // Check if user has dashboard access (at least one role)
    const hasAccess = await hasDashboardAccess();
    if (!hasAccess) {
        redirect('/access-denied');
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
