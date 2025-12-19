"use server";

import { db } from "@/lib/db/drizzle";
import { accounts, accountRoles, roles } from "@/lib/db/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export type UserRole = {
    id: string;
    nameEn: string;
    nameAr: string;
};

/**
 * Get the current user's account with roles
 */
export async function getCurrentUserWithRoles() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Get account
    const accountResult = await db
        .select()
        .from(accounts)
        .where(eq(accounts.authUserId, user.id))
        .limit(1);

    if (accountResult.length === 0) {
        return { user, account: null, roles: [] };
    }

    const account = accountResult[0];

    // Get roles for this account
    const userRoles = await db
        .select({
            id: roles.id,
            nameEn: roles.nameEn,
            nameAr: roles.nameAr,
        })
        .from(accountRoles)
        .innerJoin(roles, eq(accountRoles.roleId, roles.id))
        .where(eq(accountRoles.accountId, account.id));

    return { user, account, roles: userRoles };
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasRole(roleIds: string[]): Promise<boolean> {
    const userData = await getCurrentUserWithRoles();

    if (!userData || !userData.account) {
        return false;
    }

    return userData.roles.some((role) => roleIds.includes(role.id));
}

/**
 * Check if user has dashboard access (any role)
 */
export async function hasDashboardAccess(): Promise<boolean> {
    const userData = await getCurrentUserWithRoles();

    if (!userData || !userData.account) {
        return false;
    }

    // User needs at least one role to access dashboard
    return userData.roles.length > 0;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole(["role_admin"]);
}

/**
 * Assign a role to an account
 */
export async function assignRole(accountId: string, roleId: string): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .insert(accountRoles)
            .values({ accountId, roleId })
            .onConflictDoNothing();

        return { success: true, message: "Role assigned successfully" };
    } catch (error) {
        console.error("Error assigning role:", error);
        return { success: false, message: "Failed to assign role" };
    }
}

/**
 * Remove a role from an account
 */
export async function removeRole(accountId: string, roleId: string): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .delete(accountRoles)
            .where(and(
                eq(accountRoles.accountId, accountId),
                eq(accountRoles.roleId, roleId)
            ));

        return { success: true, message: "Role removed successfully" };
    } catch (error) {
        console.error("Error removing role:", error);
        return { success: false, message: "Failed to remove role" };
    }
}

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<UserRole[]> {
    const allRoles = await db
        .select({
            id: roles.id,
            nameEn: roles.nameEn,
            nameAr: roles.nameAr,
        })
        .from(roles);

    return allRoles;
}
