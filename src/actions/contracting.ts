"use server";

import { db } from "@/lib/db/drizzle";
import {
    contractingServices,
    works,
    materials,
    techniques,
    qualitySafetyStandards,
    contractingServiceProjects,
    contractingServiceIncludedWorks,
    contractingServiceExcludedWorks,
    contractingServiceMaterials,
    contractingServiceTechniques,
    contractingServiceQualitySafety,
    contractingServiceWhyChooseUs,
    contractingServiceFaqs,
} from "@/lib/db/schema/services-schema";
import { projects } from "@/lib/db/schema/projects-schema";
import { whyChooseUs, faqs } from "@/lib/db/schema/common-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type ContractingService = typeof contractingServices.$inferSelect;

export type ContractingServiceWithRelations = ContractingService & {
    projects: { id: string; titleEn: string; titleAr: string }[];
    includedWorks: { id: string; titleEn: string; titleAr: string }[];
    excludedWorks: { id: string; titleEn: string; titleAr: string }[];
    materials: { id: string; titleEn: string; titleAr: string }[];
    techniques: { id: string; titleEn: string; titleAr: string }[];
    qualitySafety: { id: string; titleEn: string; titleAr: string }[];
    whyChooseUs: { id: string; reasonEn: string; reasonAr: string }[];
    faqs: { id: string; questionEn: string; questionAr: string; answerEn: string; answerAr: string }[];
};

// ==================== Contracting Services ====================

export async function getAllContractingServices(): Promise<ContractingService[]> {
    return db.select().from(contractingServices).orderBy(contractingServices.createdAt);
}

export async function getContractingServiceById(id: string): Promise<ContractingServiceWithRelations | null> {
    const result = await db.select().from(contractingServices).where(eq(contractingServices.id, id)).limit(1);

    if (result.length === 0) return null;

    const service = result[0];

    const [
        serviceProjects,
        serviceIncludedWorks,
        serviceExcludedWorks,
        serviceMaterials,
        serviceTechniques,
        serviceQualitySafety,
        serviceWhyChooseUs,
        serviceFaqs,
    ] = await Promise.all([
        db.select({ id: projects.id, titleEn: projects.titleEn, titleAr: projects.titleAr })
            .from(contractingServiceProjects)
            .innerJoin(projects, eq(contractingServiceProjects.projectId, projects.id))
            .where(eq(contractingServiceProjects.contractingServiceId, id)),
        db.select({ id: works.id, titleEn: works.titleEn, titleAr: works.titleAr })
            .from(contractingServiceIncludedWorks)
            .innerJoin(works, eq(contractingServiceIncludedWorks.workId, works.id))
            .where(eq(contractingServiceIncludedWorks.contractingServiceId, id)),
        db.select({ id: works.id, titleEn: works.titleEn, titleAr: works.titleAr })
            .from(contractingServiceExcludedWorks)
            .innerJoin(works, eq(contractingServiceExcludedWorks.workId, works.id))
            .where(eq(contractingServiceExcludedWorks.contractingServiceId, id)),
        db.select({ id: materials.id, titleEn: materials.titleEn, titleAr: materials.titleAr })
            .from(contractingServiceMaterials)
            .innerJoin(materials, eq(contractingServiceMaterials.materialId, materials.id))
            .where(eq(contractingServiceMaterials.contractingServiceId, id)),
        db.select({ id: techniques.id, titleEn: techniques.titleEn, titleAr: techniques.titleAr })
            .from(contractingServiceTechniques)
            .innerJoin(techniques, eq(contractingServiceTechniques.techniqueId, techniques.id))
            .where(eq(contractingServiceTechniques.contractingServiceId, id)),
        db.select({ id: qualitySafetyStandards.id, titleEn: qualitySafetyStandards.titleEn, titleAr: qualitySafetyStandards.titleAr })
            .from(contractingServiceQualitySafety)
            .innerJoin(qualitySafetyStandards, eq(contractingServiceQualitySafety.qualitySafetyStandardId, qualitySafetyStandards.id))
            .where(eq(contractingServiceQualitySafety.contractingServiceId, id)),
        db.select({ id: whyChooseUs.id, reasonEn: whyChooseUs.reasonEn, reasonAr: whyChooseUs.reasonAr })
            .from(contractingServiceWhyChooseUs)
            .innerJoin(whyChooseUs, eq(contractingServiceWhyChooseUs.whyChooseUsId, whyChooseUs.id))
            .where(eq(contractingServiceWhyChooseUs.contractingServiceId, id)),
        db.select({
            id: faqs.id,
            questionEn: faqs.questionEn,
            questionAr: faqs.questionAr,
            answerEn: faqs.answerEn,
            answerAr: faqs.answerAr,
        })
            .from(contractingServiceFaqs)
            .innerJoin(faqs, eq(contractingServiceFaqs.faqId, faqs.id))
            .where(eq(contractingServiceFaqs.contractingServiceId, id)),
    ]);

    return {
        ...service,
        projects: serviceProjects,
        includedWorks: serviceIncludedWorks,
        excludedWorks: serviceExcludedWorks,
        materials: serviceMaterials,
        techniques: serviceTechniques,
        qualitySafety: serviceQualitySafety,
        whyChooseUs: serviceWhyChooseUs,
        faqs: serviceFaqs,
    };
}

export async function createContractingService(data: {
    titleEn: string;
    titleAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    targetAudienceEn?: string;
    targetAudienceAr?: string;
    whenNeededEn?: string;
    whenNeededAr?: string;
    slugEn: string;
    slugAr: string;
    mainImageId?: string | null;
    projectIds: string[];
    includedWorkIds: string[];
    excludedWorkIds: string[];
    materialIds: string[];
    techniqueIds: string[];
    qualitySafetyIds: string[];
    whyChooseUsIds: string[];
    faqIds: string[];
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();

        await db.insert(contractingServices).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            targetAudienceEn: data.targetAudienceEn || null,
            targetAudienceAr: data.targetAudienceAr || null,
            whenNeededEn: data.whenNeededEn || null,
            whenNeededAr: data.whenNeededAr || null,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            mainImageId: data.mainImageId || null,
            mainServiceId: "service_contracting",
        });

        // Insert junction records
        await Promise.all([
            ...data.projectIds.map(projectId =>
                db.insert(contractingServiceProjects).values({ contractingServiceId: id, projectId }).onConflictDoNothing()
            ),
            ...data.includedWorkIds.map(workId =>
                db.insert(contractingServiceIncludedWorks).values({ contractingServiceId: id, workId }).onConflictDoNothing()
            ),
            ...data.excludedWorkIds.map(workId =>
                db.insert(contractingServiceExcludedWorks).values({ contractingServiceId: id, workId }).onConflictDoNothing()
            ),
            ...data.materialIds.map(materialId =>
                db.insert(contractingServiceMaterials).values({ contractingServiceId: id, materialId }).onConflictDoNothing()
            ),
            ...data.techniqueIds.map(techniqueId =>
                db.insert(contractingServiceTechniques).values({ contractingServiceId: id, techniqueId }).onConflictDoNothing()
            ),
            ...data.qualitySafetyIds.map(qualitySafetyStandardId =>
                db.insert(contractingServiceQualitySafety).values({ contractingServiceId: id, qualitySafetyStandardId }).onConflictDoNothing()
            ),
            ...data.whyChooseUsIds.map(whyChooseUsId =>
                db.insert(contractingServiceWhyChooseUs).values({ contractingServiceId: id, whyChooseUsId }).onConflictDoNothing()
            ),
            ...data.faqIds.map(faqId =>
                db.insert(contractingServiceFaqs).values({ contractingServiceId: id, faqId }).onConflictDoNothing()
            ),
        ]);

        return { success: true, message: "Contracting service created", id };
    } catch (error) {
        console.error("Error creating contracting service:", error);
        return { success: false, message: "Failed to create contracting service" };
    }
}

export async function updateContractingService(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        descriptionEn?: string;
        descriptionAr?: string;
        targetAudienceEn?: string;
        targetAudienceAr?: string;
        whenNeededEn?: string;
        whenNeededAr?: string;
        slugEn: string;
        slugAr: string;
        mainImageId?: string | null;
        projectIds: string[];
        includedWorkIds: string[];
        excludedWorkIds: string[];
        materialIds: string[];
        techniqueIds: string[];
        qualitySafetyIds: string[];
        whyChooseUsIds: string[];
        faqIds: string[];
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(contractingServices).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            targetAudienceEn: data.targetAudienceEn || null,
            targetAudienceAr: data.targetAudienceAr || null,
            whenNeededEn: data.whenNeededEn || null,
            whenNeededAr: data.whenNeededAr || null,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            mainImageId: data.mainImageId || null,
        }).where(eq(contractingServices.id, id));

        // Delete existing junctions
        await Promise.all([
            db.delete(contractingServiceProjects).where(eq(contractingServiceProjects.contractingServiceId, id)),
            db.delete(contractingServiceIncludedWorks).where(eq(contractingServiceIncludedWorks.contractingServiceId, id)),
            db.delete(contractingServiceExcludedWorks).where(eq(contractingServiceExcludedWorks.contractingServiceId, id)),
            db.delete(contractingServiceMaterials).where(eq(contractingServiceMaterials.contractingServiceId, id)),
            db.delete(contractingServiceTechniques).where(eq(contractingServiceTechniques.contractingServiceId, id)),
            db.delete(contractingServiceQualitySafety).where(eq(contractingServiceQualitySafety.contractingServiceId, id)),
            db.delete(contractingServiceWhyChooseUs).where(eq(contractingServiceWhyChooseUs.contractingServiceId, id)),
            db.delete(contractingServiceFaqs).where(eq(contractingServiceFaqs.contractingServiceId, id)),
        ]);

        // Re-insert junctions
        await Promise.all([
            ...data.projectIds.map(projectId =>
                db.insert(contractingServiceProjects).values({ contractingServiceId: id, projectId }).onConflictDoNothing()
            ),
            ...data.includedWorkIds.map(workId =>
                db.insert(contractingServiceIncludedWorks).values({ contractingServiceId: id, workId }).onConflictDoNothing()
            ),
            ...data.excludedWorkIds.map(workId =>
                db.insert(contractingServiceExcludedWorks).values({ contractingServiceId: id, workId }).onConflictDoNothing()
            ),
            ...data.materialIds.map(materialId =>
                db.insert(contractingServiceMaterials).values({ contractingServiceId: id, materialId }).onConflictDoNothing()
            ),
            ...data.techniqueIds.map(techniqueId =>
                db.insert(contractingServiceTechniques).values({ contractingServiceId: id, techniqueId }).onConflictDoNothing()
            ),
            ...data.qualitySafetyIds.map(qualitySafetyStandardId =>
                db.insert(contractingServiceQualitySafety).values({ contractingServiceId: id, qualitySafetyStandardId }).onConflictDoNothing()
            ),
            ...data.whyChooseUsIds.map(whyChooseUsId =>
                db.insert(contractingServiceWhyChooseUs).values({ contractingServiceId: id, whyChooseUsId }).onConflictDoNothing()
            ),
            ...data.faqIds.map(faqId =>
                db.insert(contractingServiceFaqs).values({ contractingServiceId: id, faqId }).onConflictDoNothing()
            ),
        ]);

        return { success: true, message: "Contracting service updated" };
    } catch (error) {
        console.error("Error updating contracting service:", error);
        return { success: false, message: "Failed to update contracting service" };
    }
}

export async function deleteContractingService(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(contractingServices).where(eq(contractingServices.id, id));
        return { success: true, message: "Contracting service deleted" };
    } catch (error) {
        console.error("Error deleting contracting service:", error);
        return { success: false, message: "Failed to delete contracting service" };
    }
}

// ==================== Helper: Get all projects for selection ====================

export async function getAllProjects(): Promise<{ id: string; titleEn: string; titleAr: string }[]> {
    return db.select({ id: projects.id, titleEn: projects.titleEn, titleAr: projects.titleAr }).from(projects).orderBy(projects.titleEn);
}
