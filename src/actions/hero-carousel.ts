"use server";

import { db } from "@/lib/db/drizzle";
import {
    heroSections,
    heroSlides,
} from "@/lib/db/schema/hero-carousel-schema";
import type { SlideType } from "@/lib/db/schema/hero-carousel-schema";
export type { SlideType } from "@/lib/db/schema/hero-carousel-schema";
import { images } from "@/lib/db/schema/images-schema";
import { articles } from "@/lib/db/schema/blog-schema";
import { products } from "@/lib/db/schema/products-schema";
import { mainServices, importServices, contractingServices } from "@/lib/db/schema/services-schema";
import { projects } from "@/lib/db/schema/projects-schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type HeroSection = typeof heroSections.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;

export type HeroSlideWithRelations = HeroSlide & {
    heroSection?: { id: string; titleEn: string; titleAr: string } | null;
    parentImportService?: { id: string; titleEn: string; titleAr: string } | null;
    parentContractingService?: { id: string; titleEn: string; titleAr: string } | null;
    backgroundImage?: { id: string; url: string } | null;
    article?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
    product?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
    mainService?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
    importService?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
    contractingService?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
    project?: { id: string; titleEn: string; titleAr: string; slugEn: string } | null;
};

export type CreateHeroSlideData = {
    heroSectionId?: string | null;
    parentImportServiceId?: string | null;
    parentContractingServiceId?: string | null;
    titleEn: string;
    titleAr: string;
    subtitleEn?: string | null;
    subtitleAr?: string | null;
    slideType: SlideType;
    articleId?: string | null;
    productId?: string | null;
    mainServiceId?: string | null;
    importServiceId?: string | null;
    contractingServiceId?: string | null;
    projectId?: string | null;
    ctaEnabled?: boolean;
    ctaTextEn?: string | null;
    ctaTextAr?: string | null;
    ctaHref?: string | null;
    backgroundImageId?: string | null;
    backgroundColor?: string | null;
    overlayOpacity?: number;
    isActive?: boolean;
    sortOrder?: number;
};

// ==================== Hero Sections CRUD ====================

export async function getAllHeroSections(): Promise<HeroSection[]> {
    return db.select().from(heroSections).orderBy(heroSections.titleEn);
}

export async function getHeroSectionById(id: string): Promise<HeroSection | null> {
    const result = await db
        .select()
        .from(heroSections)
        .where(eq(heroSections.id, id))
        .limit(1);
    return result.length > 0 ? result[0] : null;
}

export async function createHeroSection(data: {
    titleEn: string;
    titleAr: string;
    slugEn: string;
    slugAr: string;
    isActive?: boolean;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(heroSections).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            isActive: data.isActive ?? true,
        });
        return { success: true, message: "Hero section created", id };
    } catch (error) {
        console.error("Error creating hero section:", error);
        return { success: false, message: "Failed to create hero section" };
    }
}

export async function updateHeroSection(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        isActive?: boolean;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(heroSections).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            isActive: data.isActive ?? true,
        }).where(eq(heroSections.id, id));
        return { success: true, message: "Hero section updated" };
    } catch (error) {
        console.error("Error updating hero section:", error);
        return { success: false, message: "Failed to update hero section" };
    }
}

export async function deleteHeroSection(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(heroSections).where(eq(heroSections.id, id));
        return { success: true, message: "Hero section deleted" };
    } catch (error) {
        console.error("Error deleting hero section:", error);
        return { success: false, message: "Failed to delete hero section" };
    }
}

// ==================== Hero Slides CRUD ====================

export async function getAllHeroSlides(): Promise<HeroSlideWithRelations[]> {
    const result = await db
        .select({
            id: heroSlides.id,
            heroSectionId: heroSlides.heroSectionId,
            parentImportServiceId: heroSlides.parentImportServiceId,
            parentContractingServiceId: heroSlides.parentContractingServiceId,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            slideType: heroSlides.slideType,
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            isActive: heroSlides.isActive,
            sortOrder: heroSlides.sortOrder,
            createdAt: heroSlides.createdAt,
            updatedAt: heroSlides.updatedAt,
            backgroundImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .orderBy(asc(heroSlides.sortOrder));

    return result.map(r => ({
        ...r,
        backgroundImage: r.backgroundImage?.id ? r.backgroundImage : null,
        heroSection: null,
        parentImportService: null,
        parentContractingService: null,
        article: null,
        product: null,
        mainService: null,
        importService: null,
        contractingService: null,
        project: null,
    }));
}

export async function getHeroSlidesBySection(sectionId: string): Promise<HeroSlideWithRelations[]> {
    const result = await db
        .select({
            id: heroSlides.id,
            heroSectionId: heroSlides.heroSectionId,
            parentImportServiceId: heroSlides.parentImportServiceId,
            parentContractingServiceId: heroSlides.parentContractingServiceId,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            slideType: heroSlides.slideType,
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            isActive: heroSlides.isActive,
            sortOrder: heroSlides.sortOrder,
            createdAt: heroSlides.createdAt,
            updatedAt: heroSlides.updatedAt,
            backgroundImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .where(eq(heroSlides.heroSectionId, sectionId))
        .orderBy(asc(heroSlides.sortOrder));

    return result.map(r => ({
        ...r,
        backgroundImage: r.backgroundImage?.id ? r.backgroundImage : null,
        heroSection: null,
        parentImportService: null,
        parentContractingService: null,
        article: null,
        product: null,
        mainService: null,
        importService: null,
        contractingService: null,
        project: null,
    }));
}

export async function getHeroSlidesByImportService(serviceId: string): Promise<HeroSlideWithRelations[]> {
    const result = await db
        .select({
            id: heroSlides.id,
            heroSectionId: heroSlides.heroSectionId,
            parentImportServiceId: heroSlides.parentImportServiceId,
            parentContractingServiceId: heroSlides.parentContractingServiceId,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            slideType: heroSlides.slideType,
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            isActive: heroSlides.isActive,
            sortOrder: heroSlides.sortOrder,
            createdAt: heroSlides.createdAt,
            updatedAt: heroSlides.updatedAt,
            backgroundImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .where(eq(heroSlides.parentImportServiceId, serviceId))
        .orderBy(asc(heroSlides.sortOrder));

    return result.map(r => ({
        ...r,
        backgroundImage: r.backgroundImage?.id ? r.backgroundImage : null,
        heroSection: null,
        parentImportService: null,
        parentContractingService: null,
        article: null,
        product: null,
        mainService: null,
        importService: null,
        contractingService: null,
        project: null,
    }));
}

export async function getHeroSlidesByContractingService(serviceId: string): Promise<HeroSlideWithRelations[]> {
    const result = await db
        .select({
            id: heroSlides.id,
            heroSectionId: heroSlides.heroSectionId,
            parentImportServiceId: heroSlides.parentImportServiceId,
            parentContractingServiceId: heroSlides.parentContractingServiceId,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            slideType: heroSlides.slideType,
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            isActive: heroSlides.isActive,
            sortOrder: heroSlides.sortOrder,
            createdAt: heroSlides.createdAt,
            updatedAt: heroSlides.updatedAt,
            backgroundImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .where(eq(heroSlides.parentContractingServiceId, serviceId))
        .orderBy(asc(heroSlides.sortOrder));

    return result.map(r => ({
        ...r,
        backgroundImage: r.backgroundImage?.id ? r.backgroundImage : null,
        heroSection: null,
        parentImportService: null,
        parentContractingService: null,
        article: null,
        product: null,
        mainService: null,
        importService: null,
        contractingService: null,
        project: null,
    }));
}

export async function getHeroSlideById(id: string): Promise<HeroSlideWithRelations | null> {
    const result = await db
        .select({
            id: heroSlides.id,
            heroSectionId: heroSlides.heroSectionId,
            parentImportServiceId: heroSlides.parentImportServiceId,
            parentContractingServiceId: heroSlides.parentContractingServiceId,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            slideType: heroSlides.slideType,
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            isActive: heroSlides.isActive,
            sortOrder: heroSlides.sortOrder,
            createdAt: heroSlides.createdAt,
            updatedAt: heroSlides.updatedAt,
            backgroundImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .where(eq(heroSlides.id, id))
        .limit(1);

    if (result.length === 0) return null;

    const r = result[0];
    return {
        ...r,
        backgroundImage: r.backgroundImage?.id ? r.backgroundImage : null,
        heroSection: null,
        parentImportService: null,
        parentContractingService: null,
        article: null,
        product: null,
        mainService: null,
        importService: null,
        contractingService: null,
        project: null,
    };
}

export async function createHeroSlide(data: CreateHeroSlideData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(heroSlides).values({
            id,
            heroSectionId: data.heroSectionId || null,
            parentImportServiceId: data.parentImportServiceId || null,
            parentContractingServiceId: data.parentContractingServiceId || null,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            subtitleEn: data.subtitleEn || null,
            subtitleAr: data.subtitleAr || null,
            slideType: data.slideType,
            articleId: data.articleId || null,
            productId: data.productId || null,
            mainServiceId: data.mainServiceId || null,
            importServiceId: data.importServiceId || null,
            contractingServiceId: data.contractingServiceId || null,
            projectId: data.projectId || null,
            ctaEnabled: data.ctaEnabled ?? false,
            ctaTextEn: data.ctaTextEn || null,
            ctaTextAr: data.ctaTextAr || null,
            ctaHref: data.ctaHref || null,
            backgroundImageId: data.backgroundImageId || null,
            backgroundColor: data.backgroundColor || null,
            overlayOpacity: data.overlayOpacity ?? 0,
            isActive: data.isActive ?? true,
            sortOrder: data.sortOrder ?? 0,
        });
        return { success: true, message: "Hero slide created", id };
    } catch (error) {
        console.error("Error creating hero slide:", error);
        return { success: false, message: "Failed to create hero slide" };
    }
}

export async function updateHeroSlide(
    id: string,
    data: CreateHeroSlideData
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(heroSlides).set({
            heroSectionId: data.heroSectionId || null,
            parentImportServiceId: data.parentImportServiceId || null,
            parentContractingServiceId: data.parentContractingServiceId || null,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            subtitleEn: data.subtitleEn || null,
            subtitleAr: data.subtitleAr || null,
            slideType: data.slideType,
            articleId: data.articleId || null,
            productId: data.productId || null,
            mainServiceId: data.mainServiceId || null,
            importServiceId: data.importServiceId || null,
            contractingServiceId: data.contractingServiceId || null,
            projectId: data.projectId || null,
            ctaEnabled: data.ctaEnabled ?? false,
            ctaTextEn: data.ctaTextEn || null,
            ctaTextAr: data.ctaTextAr || null,
            ctaHref: data.ctaHref || null,
            backgroundImageId: data.backgroundImageId || null,
            backgroundColor: data.backgroundColor || null,
            overlayOpacity: data.overlayOpacity ?? 0,
            isActive: data.isActive ?? true,
            sortOrder: data.sortOrder ?? 0,
        }).where(eq(heroSlides.id, id));
        return { success: true, message: "Hero slide updated" };
    } catch (error) {
        console.error("Error updating hero slide:", error);
        return { success: false, message: "Failed to update hero slide" };
    }
}

export async function deleteHeroSlide(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(heroSlides).where(eq(heroSlides.id, id));
        return { success: true, message: "Hero slide deleted" };
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        return { success: false, message: "Failed to delete hero slide" };
    }
}

export async function reorderHeroSlides(slideIds: string[]): Promise<{ success: boolean; message: string }> {
    try {
        await Promise.all(
            slideIds.map((id, index) =>
                db.update(heroSlides).set({ sortOrder: index }).where(eq(heroSlides.id, id))
            )
        );
        return { success: true, message: "Slides reordered" };
    } catch (error) {
        console.error("Error reordering slides:", error);
        return { success: false, message: "Failed to reorder slides" };
    }
}

// ==================== Content Helpers ====================

export type AvailableContent = {
    articles: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
    products: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
    mainServices: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
    importServices: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
    contractingServices: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
    projects: { id: string; titleEn: string; titleAr: string; slugEn: string }[];
};

export async function getAvailableContentForSlides(): Promise<AvailableContent> {
    const [articlesList, productsList, mainServicesList, importServicesList, contractingServicesList, projectsList] = await Promise.all([
        db.select({ id: articles.id, titleEn: articles.titleEn, titleAr: articles.titleAr, slugEn: articles.slugEn }).from(articles),
        db.select({ id: products.id, titleEn: products.titleEn, titleAr: products.titleAr, slugEn: products.slugEn }).from(products),
        db.select({ id: mainServices.id, titleEn: mainServices.titleEn, titleAr: mainServices.titleAr, slugEn: mainServices.slugEn }).from(mainServices),
        db.select({ id: importServices.id, titleEn: importServices.titleEn, titleAr: importServices.titleAr, slugEn: importServices.slugEn }).from(importServices),
        db.select({ id: contractingServices.id, titleEn: contractingServices.titleEn, titleAr: contractingServices.titleAr, slugEn: contractingServices.slugEn }).from(contractingServices),
        db.select({ id: projects.id, titleEn: projects.titleEn, titleAr: projects.titleAr, slugEn: projects.slugEn }).from(projects),
    ]);

    return {
        articles: articlesList,
        products: productsList,
        mainServices: mainServicesList,
        importServices: importServicesList,
        contractingServices: contractingServicesList,
        projects: projectsList,
    };
}

// ==================== Display Helpers ====================

import type { DisplaySlide, SlideReference } from "@/types/hero-carousel";
import { articleCategories } from "@/lib/db/schema/blog-schema";
import { productCategories } from "@/lib/db/schema/products-schema";
import { projectTypes } from "@/lib/db/schema/projects-schema";

/**
 * Get slides ready for display in the carousel
 * Fetches all reference data and images from related entities
 */
export async function getSlidesForDisplayBySection(sectionId: string): Promise<DisplaySlide[]> {
    // Get base slides with background images
    const baseSlides = await db
        .select({
            id: heroSlides.id,
            slideType: heroSlides.slideType,
            titleEn: heroSlides.titleEn,
            titleAr: heroSlides.titleAr,
            subtitleEn: heroSlides.subtitleEn,
            subtitleAr: heroSlides.subtitleAr,
            ctaEnabled: heroSlides.ctaEnabled,
            ctaTextEn: heroSlides.ctaTextEn,
            ctaTextAr: heroSlides.ctaTextAr,
            ctaHref: heroSlides.ctaHref,
            backgroundImageId: heroSlides.backgroundImageId,
            backgroundColor: heroSlides.backgroundColor,
            overlayOpacity: heroSlides.overlayOpacity,
            sortOrder: heroSlides.sortOrder,
            isActive: heroSlides.isActive,
            // Reference IDs
            articleId: heroSlides.articleId,
            productId: heroSlides.productId,
            mainServiceId: heroSlides.mainServiceId,
            importServiceId: heroSlides.importServiceId,
            contractingServiceId: heroSlides.contractingServiceId,
            projectId: heroSlides.projectId,
            // Background image URL
            backgroundImageUrl: images.url,
        })
        .from(heroSlides)
        .leftJoin(images, eq(heroSlides.backgroundImageId, images.id))
        .where(eq(heroSlides.heroSectionId, sectionId))
        .orderBy(asc(heroSlides.sortOrder));

    // Filter active slides
    const activeSlides = baseSlides.filter(s => s.isActive);

    // Build display slides with reference data
    const displaySlides: DisplaySlide[] = await Promise.all(
        activeSlides.map(async (slide) => {
            let reference: SlideReference | null = null;

            // Fetch reference data based on slide type
            switch (slide.slideType) {
                case "article":
                    if (slide.articleId) {
                        const articleData = await db
                            .select({
                                id: articles.id,
                                titleEn: articles.titleEn,
                                titleAr: articles.titleAr,
                                slugEn: articles.slugEn,
                                slugAr: articles.slugAr,
                                publishedAt: articles.publishedAt,
                                imageUrl: images.url,
                                categoryName: articleCategories.titleEn,
                            })
                            .from(articles)
                            .leftJoin(images, eq(articles.mainImageId, images.id))
                            .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
                            .where(eq(articles.id, slide.articleId))
                            .limit(1);
                        if (articleData[0]) {
                            reference = {
                                ...articleData[0],
                                categoryName: articleData[0].categoryName,
                                publishedAt: articleData[0].publishedAt,
                            };
                        }
                    }
                    break;

                case "product":
                    if (slide.productId) {
                        const productData = await db
                            .select({
                                id: products.id,
                                titleEn: products.titleEn,
                                titleAr: products.titleAr,
                                slugEn: products.slugEn,
                                slugAr: products.slugAr,
                                descriptionEn: products.descriptionEn,
                                descriptionAr: products.descriptionAr,
                                imageUrl: images.url,
                                productCategoryName: productCategories.titleEn,
                            })
                            .from(products)
                            .leftJoin(images, eq(products.mainImageId, images.id))
                            .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
                            .where(eq(products.id, slide.productId))
                            .limit(1);
                        if (productData[0]) {
                            reference = {
                                ...productData[0],
                                productCategoryName: productData[0].productCategoryName,
                            };
                        }
                    }
                    break;

                case "main_service":
                    if (slide.mainServiceId) {
                        const serviceData = await db
                            .select({
                                id: mainServices.id,
                                titleEn: mainServices.titleEn,
                                titleAr: mainServices.titleAr,
                                slugEn: mainServices.slugEn,
                                slugAr: mainServices.slugAr,
                                descriptionEn: mainServices.descriptionEn,
                                descriptionAr: mainServices.descriptionAr,
                                imageUrl: images.url,
                            })
                            .from(mainServices)
                            .leftJoin(images, eq(mainServices.mainImageId, images.id))
                            .where(eq(mainServices.id, slide.mainServiceId))
                            .limit(1);
                        if (serviceData[0]) {
                            reference = serviceData[0];
                        }
                    }
                    break;

                case "import_service":
                    if (slide.importServiceId) {
                        const serviceData = await db
                            .select({
                                id: importServices.id,
                                titleEn: importServices.titleEn,
                                titleAr: importServices.titleAr,
                                slugEn: importServices.slugEn,
                                slugAr: importServices.slugAr,
                                descriptionEn: importServices.descriptionEn,
                                descriptionAr: importServices.descriptionAr,
                                imageUrl: images.url,
                            })
                            .from(importServices)
                            .leftJoin(images, eq(importServices.mainImageId, images.id))
                            .where(eq(importServices.id, slide.importServiceId))
                            .limit(1);
                        if (serviceData[0]) {
                            reference = serviceData[0];
                        }
                    }
                    break;

                case "contracting_service":
                    if (slide.contractingServiceId) {
                        const serviceData = await db
                            .select({
                                id: contractingServices.id,
                                titleEn: contractingServices.titleEn,
                                titleAr: contractingServices.titleAr,
                                slugEn: contractingServices.slugEn,
                                slugAr: contractingServices.slugAr,
                                descriptionEn: contractingServices.descriptionEn,
                                descriptionAr: contractingServices.descriptionAr,
                                imageUrl: images.url,
                            })
                            .from(contractingServices)
                            .leftJoin(images, eq(contractingServices.mainImageId, images.id))
                            .where(eq(contractingServices.id, slide.contractingServiceId))
                            .limit(1);
                        if (serviceData[0]) {
                            reference = serviceData[0];
                        }
                    }
                    break;

                case "project":
                    if (slide.projectId) {
                        const projectData = await db
                            .select({
                                id: projects.id,
                                titleEn: projects.titleEn,
                                titleAr: projects.titleAr,
                                slugEn: projects.slugEn,
                                slugAr: projects.slugAr,
                                descriptionEn: projects.descriptionEn,
                                descriptionAr: projects.descriptionAr,
                                locationEn: projects.locationEn,
                                locationAr: projects.locationAr,
                                year: projects.year,
                                imageUrl: images.url,
                                projectTypeName: projectTypes.titleEn,
                            })
                            .from(projects)
                            .leftJoin(images, eq(projects.mainImageId, images.id))
                            .leftJoin(projectTypes, eq(projects.projectTypeId, projectTypes.id))
                            .where(eq(projects.id, slide.projectId))
                            .limit(1);
                        if (projectData[0]) {
                            reference = {
                                ...projectData[0],
                                locationEn: projectData[0].locationEn,
                                locationAr: projectData[0].locationAr,
                                year: projectData[0].year,
                                projectTypeName: projectData[0].projectTypeName,
                            };
                        }
                    }
                    break;
            }

            return {
                id: slide.id,
                slideType: slide.slideType,
                titleEn: slide.titleEn,
                titleAr: slide.titleAr,
                subtitleEn: slide.subtitleEn,
                subtitleAr: slide.subtitleAr,
                ctaEnabled: slide.ctaEnabled,
                ctaTextEn: slide.ctaTextEn,
                ctaTextAr: slide.ctaTextAr,
                ctaHref: slide.ctaHref,
                backgroundImageUrl: slide.backgroundImageUrl,
                backgroundColor: slide.backgroundColor,
                overlayOpacity: slide.overlayOpacity,
                reference,
                sortOrder: slide.sortOrder,
            };
        })
    );

    return displaySlides;
}

/**
 * Get the hero section by slug
 */
export async function getHeroSectionBySlug(slug: string): Promise<HeroSection | null> {
    const result = await db
        .select()
        .from(heroSections)
        .where(eq(heroSections.slugEn, slug))
        .limit(1);

    if (result.length === 0) {
        // Try Arabic slug
        const arResult = await db
            .select()
            .from(heroSections)
            .where(eq(heroSections.slugAr, slug))
            .limit(1);
        return arResult.length > 0 ? arResult[0] : null;
    }

    return result[0];
}

