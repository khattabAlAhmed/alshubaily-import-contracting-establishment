"use server";

import { db } from "@/lib/db/drizzle";
import {
    companyProfile,
    contactInfo,
    socialMediaAccounts,
    organizationGoals,
    workPrinciples,
    generalPolicies,
    visions,
    missions,
    companyValues,
    strengths,
    experiences,
    commitments,
} from "@/lib/db/schema/website-info-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type CompanyProfile = typeof companyProfile.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type SocialMediaAccount = typeof socialMediaAccounts.$inferSelect;
export type OrganizationGoal = typeof organizationGoals.$inferSelect;
export type WorkPrinciple = typeof workPrinciples.$inferSelect;
export type GeneralPolicy = typeof generalPolicies.$inferSelect;
export type Vision = typeof visions.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type CompanyValue = typeof companyValues.$inferSelect;
export type Strength = typeof strengths.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Commitment = typeof commitments.$inferSelect;

// ==================== Company Profile ====================

export type CompanyProfileWithImages = CompanyProfile & {
    logoImageUrl?: string | null;
    heroImageUrl?: string | null;
};

export async function getCompanyProfile(): Promise<CompanyProfileWithImages | null> {
    const result = await db
        .select({
            id: companyProfile.id,
            nameEn: companyProfile.nameEn,
            nameAr: companyProfile.nameAr,
            taglineEn: companyProfile.taglineEn,
            taglineAr: companyProfile.taglineAr,
            descriptionEn: companyProfile.descriptionEn,
            descriptionAr: companyProfile.descriptionAr,
            foundedYear: companyProfile.foundedYear,
            logoImageId: companyProfile.logoImageId,
            heroImageId: companyProfile.heroImageId,
            createdAt: companyProfile.createdAt,
            updatedAt: companyProfile.updatedAt,
        })
        .from(companyProfile)
        .limit(1);

    if (result.length === 0) return null;

    const profile = result[0];

    // Fetch image URLs
    let logoImageUrl: string | null = null;
    let heroImageUrl: string | null = null;

    if (profile.logoImageId) {
        const logoResult = await db
            .select({ url: images.url })
            .from(images)
            .where(eq(images.id, profile.logoImageId))
            .limit(1);
        logoImageUrl = logoResult[0]?.url || null;
    }

    if (profile.heroImageId) {
        const heroResult = await db
            .select({ url: images.url })
            .from(images)
            .where(eq(images.id, profile.heroImageId))
            .limit(1);
        heroImageUrl = heroResult[0]?.url || null;
    }

    return { ...profile, logoImageUrl, heroImageUrl };
}

export async function upsertCompanyProfile(data: {
    nameEn: string;
    nameAr: string;
    taglineEn?: string;
    taglineAr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    foundedYear?: number;
    logoImageId?: string;
    heroImageId?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const existing = await db.select({ id: companyProfile.id }).from(companyProfile).limit(1);

        if (existing.length > 0) {
            await db.update(companyProfile).set(data).where(eq(companyProfile.id, existing[0].id));
            return { success: true, message: "Company profile updated", id: existing[0].id };
        } else {
            const id = nanoid();
            await db.insert(companyProfile).values({ id, ...data });
            return { success: true, message: "Company profile created", id };
        }
    } catch (error) {
        console.error("Error upserting company profile:", error);
        return { success: false, message: "Failed to update company profile" };
    }
}

// ==================== Contact Info ====================

export async function getAllContactInfo(): Promise<ContactInfo[]> {
    return db.select().from(contactInfo).orderBy(contactInfo.type);
}

export async function createContactInfo(data: {
    type: string;
    value: string;
    labelEn?: string;
    labelAr?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(contactInfo).values({ id, ...data });
        return { success: true, message: "Contact info created", id };
    } catch (error) {
        console.error("Error creating contact info:", error);
        return { success: false, message: "Failed to create contact info" };
    }
}

export async function updateContactInfo(
    id: string,
    data: { type: string; value: string; labelEn?: string; labelAr?: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(contactInfo).set(data).where(eq(contactInfo.id, id));
        return { success: true, message: "Contact info updated" };
    } catch (error) {
        console.error("Error updating contact info:", error);
        return { success: false, message: "Failed to update contact info" };
    }
}

export async function deleteContactInfo(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(contactInfo).where(eq(contactInfo.id, id));
        return { success: true, message: "Contact info deleted" };
    } catch (error) {
        console.error("Error deleting contact info:", error);
        return { success: false, message: "Failed to delete contact info" };
    }
}

// ==================== Social Media ====================

export async function getAllSocialMedia(): Promise<SocialMediaAccount[]> {
    return db.select().from(socialMediaAccounts).orderBy(socialMediaAccounts.platform);
}

export async function createSocialMedia(data: {
    platform: string;
    url: string;
    username?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(socialMediaAccounts).values({ id, ...data });
        return { success: true, message: "Social media account created", id };
    } catch (error) {
        console.error("Error creating social media:", error);
        return { success: false, message: "Failed to create social media account" };
    }
}

export async function updateSocialMedia(
    id: string,
    data: { platform: string; url: string; username?: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(socialMediaAccounts).set(data).where(eq(socialMediaAccounts.id, id));
        return { success: true, message: "Social media account updated" };
    } catch (error) {
        console.error("Error updating social media:", error);
        return { success: false, message: "Failed to update social media account" };
    }
}

export async function deleteSocialMedia(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(socialMediaAccounts).where(eq(socialMediaAccounts.id, id));
        return { success: true, message: "Social media account deleted" };
    } catch (error) {
        console.error("Error deleting social media:", error);
        return { success: false, message: "Failed to delete social media account" };
    }
}

// ==================== Generic CRUD for bilingual tables ====================

type BilingualData = {
    titleEn: string;
    titleAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
};

// Organization Goals
export async function getAllOrganizationGoals(): Promise<OrganizationGoal[]> {
    return db.select().from(organizationGoals).orderBy(organizationGoals.createdAt);
}

export async function createOrganizationGoal(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(organizationGoals).values({ id, ...data });
        return { success: true, message: "Goal created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create goal" };
    }
}

export async function updateOrganizationGoal(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(organizationGoals).set(data).where(eq(organizationGoals.id, id));
        return { success: true, message: "Goal updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update goal" };
    }
}

export async function deleteOrganizationGoal(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(organizationGoals).where(eq(organizationGoals.id, id));
        return { success: true, message: "Goal deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete goal" };
    }
}

// Work Principles
export async function getAllWorkPrinciples(): Promise<WorkPrinciple[]> {
    return db.select().from(workPrinciples).orderBy(workPrinciples.createdAt);
}

export async function createWorkPrinciple(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(workPrinciples).values({ id, ...data });
        return { success: true, message: "Principle created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create principle" };
    }
}

export async function updateWorkPrinciple(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(workPrinciples).set(data).where(eq(workPrinciples.id, id));
        return { success: true, message: "Principle updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update principle" };
    }
}

export async function deleteWorkPrinciple(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(workPrinciples).where(eq(workPrinciples.id, id));
        return { success: true, message: "Principle deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete principle" };
    }
}

// General Policies
export async function getAllGeneralPolicies(): Promise<GeneralPolicy[]> {
    return db.select().from(generalPolicies).orderBy(generalPolicies.createdAt);
}

export async function createGeneralPolicy(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(generalPolicies).values({ id, ...data });
        return { success: true, message: "Policy created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create policy" };
    }
}

export async function updateGeneralPolicy(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(generalPolicies).set(data).where(eq(generalPolicies.id, id));
        return { success: true, message: "Policy updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update policy" };
    }
}

export async function deleteGeneralPolicy(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(generalPolicies).where(eq(generalPolicies.id, id));
        return { success: true, message: "Policy deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete policy" };
    }
}

// Visions
export async function getAllVisions(): Promise<Vision[]> {
    return db.select().from(visions).orderBy(visions.createdAt);
}

export async function createVision(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(visions).values({ id, ...data });
        return { success: true, message: "Vision created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create vision" };
    }
}

export async function updateVision(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(visions).set(data).where(eq(visions.id, id));
        return { success: true, message: "Vision updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update vision" };
    }
}

export async function deleteVision(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(visions).where(eq(visions.id, id));
        return { success: true, message: "Vision deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete vision" };
    }
}

// Missions
export async function getAllMissions(): Promise<Mission[]> {
    return db.select().from(missions).orderBy(missions.createdAt);
}

export async function createMission(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(missions).values({ id, ...data });
        return { success: true, message: "Mission created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create mission" };
    }
}

export async function updateMission(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(missions).set(data).where(eq(missions.id, id));
        return { success: true, message: "Mission updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update mission" };
    }
}

export async function deleteMission(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(missions).where(eq(missions.id, id));
        return { success: true, message: "Mission deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete mission" };
    }
}

// Company Values
export async function getAllCompanyValues(): Promise<CompanyValue[]> {
    return db.select().from(companyValues).orderBy(companyValues.createdAt);
}

export async function createCompanyValue(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(companyValues).values({ id, ...data });
        return { success: true, message: "Value created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create value" };
    }
}

export async function updateCompanyValue(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(companyValues).set(data).where(eq(companyValues.id, id));
        return { success: true, message: "Value updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update value" };
    }
}

export async function deleteCompanyValue(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(companyValues).where(eq(companyValues.id, id));
        return { success: true, message: "Value deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete value" };
    }
}

// Strengths
export async function getAllStrengths(): Promise<Strength[]> {
    return db.select().from(strengths).orderBy(strengths.createdAt);
}

export async function createStrength(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(strengths).values({ id, ...data });
        return { success: true, message: "Strength created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create strength" };
    }
}

export async function updateStrength(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(strengths).set(data).where(eq(strengths.id, id));
        return { success: true, message: "Strength updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update strength" };
    }
}

export async function deleteStrength(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(strengths).where(eq(strengths.id, id));
        return { success: true, message: "Strength deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete strength" };
    }
}

// Experiences
export async function getAllExperiences(): Promise<Experience[]> {
    return db.select().from(experiences).orderBy(experiences.createdAt);
}

export async function createExperience(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(experiences).values({ id, ...data });
        return { success: true, message: "Experience created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create experience" };
    }
}

export async function updateExperience(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(experiences).set(data).where(eq(experiences.id, id));
        return { success: true, message: "Experience updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update experience" };
    }
}

export async function deleteExperience(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(experiences).where(eq(experiences.id, id));
        return { success: true, message: "Experience deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete experience" };
    }
}

// Commitments
export async function getAllCommitments(): Promise<Commitment[]> {
    return db.select().from(commitments).orderBy(commitments.createdAt);
}

export async function createCommitment(data: BilingualData): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(commitments).values({ id, ...data });
        return { success: true, message: "Commitment created", id };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to create commitment" };
    }
}

export async function updateCommitment(id: string, data: BilingualData): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(commitments).set(data).where(eq(commitments.id, id));
        return { success: true, message: "Commitment updated" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to update commitment" };
    }
}

export async function deleteCommitment(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(commitments).where(eq(commitments.id, id));
        return { success: true, message: "Commitment deleted" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Failed to delete commitment" };
    }
}
