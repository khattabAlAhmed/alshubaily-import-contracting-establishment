"use client";

import { useLocale } from "next-intl";
import { PageHeader } from "@/components/dashboard/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { updateRolePermissions } from "@/server/roles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { UserRole, UserPermission } from "@/server/roles";

type RoleMapping = {
    roleId: string;
    permissionId: string;
};

type RolesClientProps = {
    roles: UserRole[];
    permissions: UserPermission[];
    roleMappings: RoleMapping[];
    translations: {
        title: string;
        description: string;
        noRoles: string;
    };
    canManage: boolean;
};

export function RolesClient({ roles, permissions, roleMappings, translations, canManage }: RolesClientProps) {
    const locale = useLocale();
    const router = useRouter();

    // Track permission changes per role
    const [rolePermissionState, setRolePermissionState] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {};
        roles.forEach(role => {
            initial[role.id] = roleMappings
                .filter(m => m.roleId === role.id)
                .map(m => m.permissionId);
        });
        return initial;
    });

    const [savingRole, setSavingRole] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});

    // Group permissions by entity
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const entity = perm.key.split(".")[0];
        if (!acc[entity]) {
            acc[entity] = [];
        }
        acc[entity].push(perm);
        return acc;
    }, {} as Record<string, UserPermission[]>);

    const handlePermissionToggle = (roleId: string, permissionId: string) => {
        setRolePermissionState(prev => {
            const current = prev[roleId] || [];
            const newPerms = current.includes(permissionId)
                ? current.filter(id => id !== permissionId)
                : [...current, permissionId];

            return { ...prev, [roleId]: newPerms };
        });
        setHasChanges(prev => ({ ...prev, [roleId]: true }));
    };

    const handleSave = async (roleId: string) => {
        setSavingRole(roleId);
        const permissionIds = rolePermissionState[roleId] || [];
        const result = await updateRolePermissions(roleId, permissionIds);
        setSavingRole(null);

        if (result.success) {
            toast.success(locale === "ar" ? "تم تحديث الصلاحيات" : "Permissions updated");
            setHasChanges(prev => ({ ...prev, [roleId]: false }));
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const handleSelectAll = (roleId: string, entity: string) => {
        const entityPermIds = groupedPermissions[entity].map(p => p.id);
        setRolePermissionState(prev => {
            const current = prev[roleId] || [];
            const allSelected = entityPermIds.every(id => current.includes(id));

            let newPerms: string[];
            if (allSelected) {
                // Deselect all from this entity
                newPerms = current.filter(id => !entityPermIds.includes(id));
            } else {
                // Select all from this entity
                newPerms = [...new Set([...current, ...entityPermIds])];
            }

            return { ...prev, [roleId]: newPerms };
        });
        setHasChanges(prev => ({ ...prev, [roleId]: true }));
    };

    return (
        <>
            <PageHeader
                titleEn={translations.title}
                titleAr={translations.title}
                descriptionEn={translations.description}
                descriptionAr={translations.description}
            />

            <Tabs defaultValue={roles[0]?.id} className="space-y-4">
                <TabsList className="flex-wrap h-auto">
                    {roles.map((role) => (
                        <TabsTrigger key={role.id} value={role.id} className="relative">
                            {locale === "ar" ? role.nameAr : role.nameEn}
                            {hasChanges[role.id] && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {roles.map((role) => {
                    const currentPerms = rolePermissionState[role.id] || [];
                    const isSaving = savingRole === role.id;

                    return (
                        <TabsContent key={role.id} value={role.id}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            {locale === "ar" ? role.nameAr : role.nameEn}
                                        </CardTitle>
                                        <CardDescription>
                                            {currentPerms.length} {locale === "ar" ? "صلاحية" : "permissions"}
                                        </CardDescription>
                                    </div>
                                    {canManage && hasChanges[role.id] && (
                                        <Button onClick={() => handleSave(role.id)} disabled={isSaving}>
                                            {isSaving ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                            )}
                                            {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {Object.entries(groupedPermissions).map(([entity, perms]) => {
                                            const allSelected = perms.every(p => currentPerms.includes(p.id));
                                            const someSelected = perms.some(p => currentPerms.includes(p.id)) && !allSelected;

                                            return (
                                                <div key={entity} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold capitalize">{entity}</h4>
                                                        {canManage && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleSelectAll(role.id, entity)}
                                                            >
                                                                {allSelected
                                                                    ? (locale === "ar" ? "إلغاء الكل" : "Deselect All")
                                                                    : (locale === "ar" ? "تحديد الكل" : "Select All")
                                                                }
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                                        {perms.map((perm) => {
                                                            const isSelected = currentPerms.includes(perm.id);

                                                            if (canManage) {
                                                                return (
                                                                    <div
                                                                        key={perm.id}
                                                                        className="flex items-center space-x-2 rtl:space-x-reverse"
                                                                    >
                                                                        <Checkbox
                                                                            id={`${role.id}-${perm.id}`}
                                                                            checked={isSelected}
                                                                            onCheckedChange={() => handlePermissionToggle(role.id, perm.id)}
                                                                        />
                                                                        <label
                                                                            htmlFor={`${role.id}-${perm.id}`}
                                                                            className="text-sm cursor-pointer"
                                                                        >
                                                                            {locale === "ar" ? perm.nameAr : perm.nameEn}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <Badge
                                                                    key={perm.id}
                                                                    variant={isSelected ? "default" : "outline"}
                                                                    className={!isSelected ? "opacity-40" : ""}
                                                                >
                                                                    {locale === "ar" ? perm.nameAr : perm.nameEn}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </>
    );
}
