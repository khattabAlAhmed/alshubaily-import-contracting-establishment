import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { hasPermission, getAllRoles, getAllPermissions } from "@/server/roles";
import { RolesClient } from "./client";
import { db } from "@/lib/db/drizzle";
import { rolePermissions } from "@/lib/db/schema/auth-schema";

export default async function RolesPage() {
    // Check permission
    const canView = await hasPermission("roles.view");
    if (!canView) {
        redirect("/dashboard");
    }

    // Check if user can manage (edit) roles
    const canManage = await hasPermission("roles.manage");

    const roles = await getAllRoles();
    const permissions = await getAllPermissions();

    // Get role-permission mappings
    const roleMappings = await db.select().from(rolePermissions);

    const t = await getTranslations("dashboard.roles");

    return (
        <RolesClient
            roles={roles}
            permissions={permissions}
            roleMappings={roleMappings}
            translations={{
                title: t("title"),
                description: t("description"),
                noRoles: t("noRoles"),
            }}
            canManage={canManage}
        />
    );
}
