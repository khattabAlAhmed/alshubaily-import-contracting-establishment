"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, DataTable, type Column, type DataTableAction } from "@/components/dashboard/ui";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Image, FolderKanban, ListChecks } from "lucide-react";
import { toast } from "sonner";
import {
    deleteProject,
    type ProjectWithRelations,
    type ProjectType,
    type ProjectStatus,
} from "@/actions/projects";

type ProjectsClientProps = {
    projects: ProjectWithRelations[];
    types: ProjectType[];
    statuses: ProjectStatus[];
};

export default function ProjectsClient({ projects, types, statuses }: ProjectsClientProps) {
    const locale = useLocale();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        const result = await deleteProject(id);
        setIsDeleting(null);

        if (result.success) {
            toast.success(locale === "ar" ? "تم الحذف" : "Deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message);
        }
    };

    const columns: Column<ProjectWithRelations>[] = [
        {
            key: "image",
            labelEn: "Image",
            labelAr: "الصورة",
            className: "w-16",
            render: (item) => item.mainImage ? (
                <img src={item.mainImage.url} alt="" className="w-12 h-12 object-cover rounded" />
            ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Image className="h-5 w-5 text-muted-foreground" />
                </div>
            ),
        },
        {
            key: "titleEn",
            labelEn: "Title",
            labelAr: "العنوان",
            render: (item) => (
                <div>
                    <p className="font-medium">{locale === "ar" ? item.titleAr : item.titleEn}</p>
                    <p className="text-xs text-muted-foreground">{item.slugEn}</p>
                </div>
            ),
        },
        {
            key: "type",
            labelEn: "Type",
            labelAr: "النوع",
            render: (item) => item.projectType
                ? (locale === "ar" ? item.projectType.titleAr : item.projectType.titleEn)
                : "-",
        },
        {
            key: "status",
            labelEn: "Status",
            labelAr: "الحالة",
            render: (item) => item.projectStatus
                ? (locale === "ar" ? item.projectStatus.titleAr : item.projectStatus.titleEn)
                : "-",
        },
        {
            key: "year",
            labelEn: "Year",
            labelAr: "السنة",
            render: (item) => item.year || "-",
        },
        {
            key: "isHighlighted",
            labelEn: "Featured",
            labelAr: "مميز",
            className: "w-20 text-center",
            render: (item) => item.isHighlighted ? (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600">
                    ★
                </span>
            ) : "-",
        },
    ];

    const actions: DataTableAction<ProjectWithRelations>[] = [
        {
            type: "edit",
            labelEn: "Edit",
            labelAr: "تعديل",
            href: (item) => `/dashboard/projects/${item.id}`,
            icon: <Pencil className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
        {
            type: "delete",
            labelEn: "Delete",
            labelAr: "حذف",
            onClick: (item) => handleDelete(item.id),
            icon: <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />,
        },
    ];

    const quickActions = [
        {
            href: "/dashboard/projects/types",
            icon: FolderKanban,
            labelEn: "Project Types",
            labelAr: "أنواع المشاريع",
            countEn: `${types.length} types`,
            countAr: `${types.length} نوع`,
        },
        {
            href: "/dashboard/projects/statuses",
            icon: ListChecks,
            labelEn: "Project Statuses",
            labelAr: "حالات المشاريع",
            countEn: `${statuses.length} statuses`,
            countAr: `${statuses.length} حالة`,
        },
    ];

    return (
        <>
            <PageHeader
                titleEn="Projects"
                titleAr="المشاريع"
                descriptionEn="Manage company projects and portfolio"
                descriptionAr="إدارة مشاريع الشركة"
                actionLabel={locale === "ar" ? "مشروع جديد" : "New Project"}
                actionHref="/dashboard/projects/new"
            />

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <action.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {locale === "ar" ? action.labelAr : action.labelEn}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {locale === "ar" ? action.countAr : action.countEn}
                                    </p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>

            <DataTable
                data={projects}
                columns={columns}
                actions={actions}
                getRowId={(item) => item.id}
                searchable
                searchPlaceholder={locale === "ar" ? "بحث..." : "Search..."}
                emptyMessageEn="No projects found"
                emptyMessageAr="لا توجد مشاريع"
            />
        </>
    );
}
