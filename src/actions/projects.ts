"use server";

import { db } from "@/lib/db/drizzle";
import {
    projects,
    projectTypes,
    projectStatuses,
    projectImages,
} from "@/lib/db/schema/projects-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type ProjectType = typeof projectTypes.$inferSelect;
export type ProjectStatus = typeof projectStatuses.$inferSelect;
export type Project = typeof projects.$inferSelect;

export type ProjectWithRelations = Project & {
    projectType?: { id: string; titleEn: string; titleAr: string } | null;
    projectStatus?: { id: string; titleEn: string; titleAr: string } | null;
    mainImage?: { id: string; url: string } | null;
    images: { id: string; url: string }[];
};

// ==================== Project Types ====================

export async function getAllProjectTypes(): Promise<ProjectType[]> {
    return db.select().from(projectTypes).orderBy(projectTypes.titleEn);
}

export async function getProjectTypeById(id: string): Promise<ProjectType | null> {
    const result = await db.select().from(projectTypes).where(eq(projectTypes.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
}

export async function createProjectType(data: {
    titleEn: string;
    titleAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    imageId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(projectTypes).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            imageId: data.imageId || null,
        });
        return { success: true, message: "Project type created", id };
    } catch (error) {
        console.error("Error creating project type:", error);
        return { success: false, message: "Failed to create project type" };
    }
}

export async function updateProjectType(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        descriptionEn?: string;
        descriptionAr?: string;
        imageId?: string | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(projectTypes).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            imageId: data.imageId || null,
        }).where(eq(projectTypes.id, id));
        return { success: true, message: "Project type updated" };
    } catch (error) {
        console.error("Error updating project type:", error);
        return { success: false, message: "Failed to update project type" };
    }
}

export async function deleteProjectType(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(projectTypes).where(eq(projectTypes.id, id));
        return { success: true, message: "Project type deleted" };
    } catch (error) {
        console.error("Error deleting project type:", error);
        return { success: false, message: "Failed to delete project type" };
    }
}

// ==================== Project Statuses ====================

export async function getAllProjectStatuses(): Promise<ProjectStatus[]> {
    return db.select().from(projectStatuses).orderBy(projectStatuses.titleEn);
}

export async function getProjectStatusById(id: string): Promise<ProjectStatus | null> {
    const result = await db.select().from(projectStatuses).where(eq(projectStatuses.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
}

export async function createProjectStatus(data: {
    titleEn: string;
    titleAr: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(projectStatuses).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
        });
        return { success: true, message: "Project status created", id };
    } catch (error) {
        console.error("Error creating project status:", error);
        return { success: false, message: "Failed to create project status" };
    }
}

export async function updateProjectStatus(
    id: string,
    data: { titleEn: string; titleAr: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(projectStatuses).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
        }).where(eq(projectStatuses.id, id));
        return { success: true, message: "Project status updated" };
    } catch (error) {
        console.error("Error updating project status:", error);
        return { success: false, message: "Failed to update project status" };
    }
}

export async function deleteProjectStatus(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(projectStatuses).where(eq(projectStatuses.id, id));
        return { success: true, message: "Project status deleted" };
    } catch (error) {
        console.error("Error deleting project status:", error);
        return { success: false, message: "Failed to delete project status" };
    }
}

// ==================== Projects ====================

export async function getAllProjects(): Promise<ProjectWithRelations[]> {
    const result = await db
        .select({
            id: projects.id,
            titleEn: projects.titleEn,
            titleAr: projects.titleAr,
            mainImageId: projects.mainImageId,
            descriptionEn: projects.descriptionEn,
            descriptionAr: projects.descriptionAr,
            locationEn: projects.locationEn,
            locationAr: projects.locationAr,
            year: projects.year,
            projectTypeId: projects.projectTypeId,
            projectStatusId: projects.projectStatusId,
            slugEn: projects.slugEn,
            slugAr: projects.slugAr,
            isHighlighted: projects.isHighlighted,
            sortOrder: projects.sortOrder,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            projectType: {
                id: projectTypes.id,
                titleEn: projectTypes.titleEn,
                titleAr: projectTypes.titleAr,
            },
            projectStatus: {
                id: projectStatuses.id,
                titleEn: projectStatuses.titleEn,
                titleAr: projectStatuses.titleAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(projects)
        .leftJoin(projectTypes, eq(projects.projectTypeId, projectTypes.id))
        .leftJoin(projectStatuses, eq(projects.projectStatusId, projectStatuses.id))
        .leftJoin(images, eq(projects.mainImageId, images.id))
        .orderBy(projects.sortOrder, projects.createdAt);

    const projectsWithImages: ProjectWithRelations[] = await Promise.all(
        result.map(async (p) => {
            const projectImgs = await db
                .select({ id: images.id, url: images.url })
                .from(projectImages)
                .innerJoin(images, eq(projectImages.imageId, images.id))
                .where(eq(projectImages.projectId, p.id));

            return {
                ...p,
                projectType: p.projectType?.id ? p.projectType : null,
                projectStatus: p.projectStatus?.id ? p.projectStatus : null,
                mainImage: p.mainImage?.id ? p.mainImage : null,
                images: projectImgs,
            };
        })
    );

    return projectsWithImages;
}

export async function getHighlightedProjects(limit: number = 6): Promise<ProjectWithRelations[]> {
    // Fetch projects with main image in a single query
    const result = await db
        .select({
            id: projects.id,
            titleEn: projects.titleEn,
            titleAr: projects.titleAr,
            mainImageId: projects.mainImageId,
            descriptionEn: projects.descriptionEn,
            descriptionAr: projects.descriptionAr,
            locationEn: projects.locationEn,
            locationAr: projects.locationAr,
            year: projects.year,
            projectTypeId: projects.projectTypeId,
            projectStatusId: projects.projectStatusId,
            slugEn: projects.slugEn,
            slugAr: projects.slugAr,
            isHighlighted: projects.isHighlighted,
            sortOrder: projects.sortOrder,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            projectType: {
                id: projectTypes.id,
                titleEn: projectTypes.titleEn,
                titleAr: projectTypes.titleAr,
            },
            projectStatus: {
                id: projectStatuses.id,
                titleEn: projectStatuses.titleEn,
                titleAr: projectStatuses.titleAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(projects)
        .leftJoin(projectTypes, eq(projects.projectTypeId, projectTypes.id))
        .leftJoin(projectStatuses, eq(projects.projectStatusId, projectStatuses.id))
        .leftJoin(images, eq(projects.mainImageId, images.id))
        .where(eq(projects.isHighlighted, true))
        .orderBy(projects.sortOrder)
        .limit(limit);

    if (result.length === 0) {
        return [];
    }

    // OPTIMIZED: Batch fetch all project images in a single query
    const projectIds = result.map(p => p.id);
    const allProjectImages = await db
        .select({
            projectId: projectImages.projectId,
            id: images.id,
            url: images.url
        })
        .from(projectImages)
        .innerJoin(images, eq(projectImages.imageId, images.id))
        .where(inArray(projectImages.projectId, projectIds));

    // Create a Map for O(1) lookup of images by project ID
    const imagesByProject = new Map<string, { id: string; url: string }[]>();
    allProjectImages.forEach(img => {
        const existing = imagesByProject.get(img.projectId) || [];
        existing.push({ id: img.id, url: img.url });
        imagesByProject.set(img.projectId, existing);
    });

    // Build the result using the map (no additional queries)
    const projectsWithImages: ProjectWithRelations[] = result.map(p => ({
        ...p,
        projectType: p.projectType?.id ? p.projectType : null,
        projectStatus: p.projectStatus?.id ? p.projectStatus : null,
        mainImage: p.mainImage?.id ? p.mainImage : null,
        images: imagesByProject.get(p.id) || [],
    }));

    return projectsWithImages;
}

export async function getProjectById(id: string): Promise<ProjectWithRelations | null> {
    const result = await db
        .select({
            id: projects.id,
            titleEn: projects.titleEn,
            titleAr: projects.titleAr,
            mainImageId: projects.mainImageId,
            descriptionEn: projects.descriptionEn,
            descriptionAr: projects.descriptionAr,
            locationEn: projects.locationEn,
            locationAr: projects.locationAr,
            year: projects.year,
            projectTypeId: projects.projectTypeId,
            projectStatusId: projects.projectStatusId,
            slugEn: projects.slugEn,
            slugAr: projects.slugAr,
            isHighlighted: projects.isHighlighted,
            sortOrder: projects.sortOrder,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            projectType: {
                id: projectTypes.id,
                titleEn: projectTypes.titleEn,
                titleAr: projectTypes.titleAr,
            },
            projectStatus: {
                id: projectStatuses.id,
                titleEn: projectStatuses.titleEn,
                titleAr: projectStatuses.titleAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(projects)
        .leftJoin(projectTypes, eq(projects.projectTypeId, projectTypes.id))
        .leftJoin(projectStatuses, eq(projects.projectStatusId, projectStatuses.id))
        .leftJoin(images, eq(projects.mainImageId, images.id))
        .where(eq(projects.id, id))
        .limit(1);

    if (result.length === 0) return null;

    const project = result[0];

    const projectImgs = await db
        .select({ id: images.id, url: images.url })
        .from(projectImages)
        .innerJoin(images, eq(projectImages.imageId, images.id))
        .where(eq(projectImages.projectId, id));

    return {
        ...project,
        projectType: project.projectType?.id ? project.projectType : null,
        projectStatus: project.projectStatus?.id ? project.projectStatus : null,
        mainImage: project.mainImage?.id ? project.mainImage : null,
        images: projectImgs,
    };
}

export async function createProject(data: {
    titleEn: string;
    titleAr: string;
    slugEn: string;
    slugAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    locationEn?: string;
    locationAr?: string;
    year?: number | null;
    projectTypeId?: string | null;
    projectStatusId?: string | null;
    mainImageId?: string | null;
    imageIds?: string[];
    isHighlighted?: boolean;
    sortOrder?: number;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();

        await db.insert(projects).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            locationEn: data.locationEn || null,
            locationAr: data.locationAr || null,
            year: data.year || null,
            projectTypeId: data.projectTypeId || null,
            projectStatusId: data.projectStatusId || null,
            mainImageId: data.mainImageId || null,
            isHighlighted: data.isHighlighted || false,
            sortOrder: data.sortOrder || 0,
        });

        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(projectImages).values({ projectId: id, imageId }).onConflictDoNothing()
                )
            );
        }

        return { success: true, message: "Project created", id };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, message: "Failed to create project" };
    }
}

export async function updateProject(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        descriptionEn?: string;
        descriptionAr?: string;
        locationEn?: string;
        locationAr?: string;
        year?: number | null;
        projectTypeId?: string | null;
        projectStatusId?: string | null;
        mainImageId?: string | null;
        imageIds?: string[];
        isHighlighted?: boolean;
        sortOrder?: number;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(projects).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            locationEn: data.locationEn || null,
            locationAr: data.locationAr || null,
            year: data.year || null,
            projectTypeId: data.projectTypeId || null,
            projectStatusId: data.projectStatusId || null,
            mainImageId: data.mainImageId || null,
            isHighlighted: data.isHighlighted ?? false,
            sortOrder: data.sortOrder ?? 0,
        }).where(eq(projects.id, id));

        // Update project images
        await db.delete(projectImages).where(eq(projectImages.projectId, id));

        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(projectImages).values({ projectId: id, imageId }).onConflictDoNothing()
                )
            );
        }

        return { success: true, message: "Project updated" };
    } catch (error) {
        console.error("Error updating project:", error);
        return { success: false, message: "Failed to update project" };
    }
}

export async function deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(projects).where(eq(projects.id, id));
        return { success: true, message: "Project deleted" };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project" };
    }
}

import { unstable_cache } from "next/cache";

/**
 * Cached version of getHighlightedProjects - caches for 60 seconds
 */
export const getCachedHighlightedProjects = unstable_cache(
    getHighlightedProjects,
    ["highlighted-projects"],
    { revalidate: 60, tags: ["highlighted-projects"] }
);
