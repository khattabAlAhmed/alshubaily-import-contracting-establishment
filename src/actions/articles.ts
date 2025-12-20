"use server";

import { db } from "@/lib/db/drizzle";
import {
    articleCategories,
    authors,
    articles,
    articleImages,
} from "@/lib/db/schema/blog-schema";
import { richContents } from "@/lib/db/schema/rich-content-schema";
import { accounts, accountRoles } from "@/lib/db/schema/auth-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type ArticleCategory = typeof articleCategories.$inferSelect;
export type Author = typeof authors.$inferSelect & {
    account?: { id: string; displayNameEn: string | null; displayNameAr: string | null } | null;
};
export type Article = typeof articles.$inferSelect;

export type ArticleWithRelations = Article & {
    category?: { id: string; titleEn: string; titleAr: string } | null;
    author?: { id: string; publicNameEn: string; publicNameAr: string } | null;
    mainImage?: { id: string; url: string } | null;
    richContent?: { id: string; contentEn: string | null; contentAr: string | null } | null;
    images: { id: string; url: string }[];
};

export type AdminAccount = {
    id: string;
    displayNameEn: string | null;
    displayNameAr: string | null;
};

// Alias for clarity
export type AuthorAccount = AdminAccount;

// ==================== Current User Author ====================

export async function getCurrentUserAuthor(): Promise<{ authorId: string | null; accountId: string | null }> {
    // Dynamic import to avoid circular dependencies
    const { getCurrentUserWithRoles } = await import("@/server/roles");

    const userData = await getCurrentUserWithRoles();

    if (!userData || !userData.account) {
        return { authorId: null, accountId: null };
    }

    // Check if this account has an author record
    const authorResult = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.accountId, userData.account.id))
        .limit(1);

    return {
        authorId: authorResult.length > 0 ? authorResult[0].id : null,
        accountId: userData.account.id,
    };
}

// ==================== Article Categories ====================

export async function getAllArticleCategories(): Promise<ArticleCategory[]> {
    return db.select().from(articleCategories).orderBy(articleCategories.titleEn);
}

export async function createArticleCategory(data: {
    titleEn: string;
    titleAr: string;
    slugEn: string;
    slugAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    imageId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(articleCategories).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            imageId: data.imageId || null,
        });
        return { success: true, message: "Category created", id };
    } catch (error) {
        console.error("Error creating article category:", error);
        return { success: false, message: "Failed to create category" };
    }
}

export async function updateArticleCategory(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        descriptionEn?: string;
        descriptionAr?: string;
        imageId?: string | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(articleCategories).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            imageId: data.imageId || null,
        }).where(eq(articleCategories.id, id));
        return { success: true, message: "Category updated" };
    } catch (error) {
        console.error("Error updating article category:", error);
        return { success: false, message: "Failed to update category" };
    }
}

export async function deleteArticleCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(articleCategories).where(eq(articleCategories.id, id));
        return { success: true, message: "Category deleted" };
    } catch (error) {
        console.error("Error deleting article category:", error);
        return { success: false, message: "Failed to delete category" };
    }
}

// ==================== Authors ====================

export async function getAllAuthors(): Promise<Author[]> {
    const result = await db
        .select({
            id: authors.id,
            publicNameEn: authors.publicNameEn,
            publicNameAr: authors.publicNameAr,
            accountId: authors.accountId,
            createdAt: authors.createdAt,
            updatedAt: authors.updatedAt,
            account: {
                id: accounts.id,
                displayNameEn: accounts.displayNameEn,
                displayNameAr: accounts.displayNameAr,
            },
        })
        .from(authors)
        .leftJoin(accounts, eq(authors.accountId, accounts.id))
        .orderBy(authors.publicNameEn);

    return result.map(r => ({
        ...r,
        account: r.account?.id ? r.account : null,
    }));
}

export async function getAuthorAccounts(): Promise<AuthorAccount[]> {
    // Get accounts that have the author role
    const result = await db
        .select({
            id: accounts.id,
            displayNameEn: accounts.displayNameEn,
            displayNameAr: accounts.displayNameAr,
        })
        .from(accounts)
        .innerJoin(accountRoles, eq(accounts.id, accountRoles.accountId))
        .where(eq(accountRoles.roleId, "role_author"));

    return result;
}

// Keep for backwards compatibility
export const getAdminAccounts = getAuthorAccounts;

export async function createAuthor(data: {
    publicNameEn: string;
    publicNameAr: string;
    accountId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(authors).values({
            id,
            publicNameEn: data.publicNameEn,
            publicNameAr: data.publicNameAr,
            accountId: data.accountId || null,
        });
        return { success: true, message: "Author created", id };
    } catch (error) {
        console.error("Error creating author:", error);
        return { success: false, message: "Failed to create author" };
    }
}

export async function updateAuthor(
    id: string,
    data: { publicNameEn: string; publicNameAr: string; accountId?: string | null }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(authors).set({
            publicNameEn: data.publicNameEn,
            publicNameAr: data.publicNameAr,
            accountId: data.accountId || null,
        }).where(eq(authors.id, id));
        return { success: true, message: "Author updated" };
    } catch (error) {
        console.error("Error updating author:", error);
        return { success: false, message: "Failed to update author" };
    }
}

export async function deleteAuthor(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(authors).where(eq(authors.id, id));
        return { success: true, message: "Author deleted" };
    } catch (error) {
        console.error("Error deleting author:", error);
        return { success: false, message: "Failed to delete author" };
    }
}

// ==================== Articles ====================

export async function getAllArticles(): Promise<ArticleWithRelations[]> {
    const result = await db
        .select({
            id: articles.id,
            titleEn: articles.titleEn,
            titleAr: articles.titleAr,
            mainImageId: articles.mainImageId,
            richContentId: articles.richContentId,
            authorId: articles.authorId,
            categoryId: articles.categoryId,
            slugEn: articles.slugEn,
            slugAr: articles.slugAr,
            publishedAt: articles.publishedAt,
            createdAt: articles.createdAt,
            updatedAt: articles.updatedAt,
            category: {
                id: articleCategories.id,
                titleEn: articleCategories.titleEn,
                titleAr: articleCategories.titleAr,
            },
            author: {
                id: authors.id,
                publicNameEn: authors.publicNameEn,
                publicNameAr: authors.publicNameAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(articles)
        .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
        .leftJoin(authors, eq(articles.authorId, authors.id))
        .leftJoin(images, eq(articles.mainImageId, images.id))
        .orderBy(articles.createdAt);

    const articlesWithImages: ArticleWithRelations[] = await Promise.all(
        result.map(async (a) => {
            const articleImgs = await db
                .select({ id: images.id, url: images.url })
                .from(articleImages)
                .innerJoin(images, eq(articleImages.imageId, images.id))
                .where(eq(articleImages.articleId, a.id));

            return {
                ...a,
                category: a.category?.id ? a.category : null,
                author: a.author?.id ? a.author : null,
                mainImage: a.mainImage?.id ? a.mainImage : null,
                richContent: null,
                images: articleImgs,
            };
        })
    );

    return articlesWithImages;
}

export async function getArticleById(id: string): Promise<ArticleWithRelations | null> {
    const result = await db
        .select({
            id: articles.id,
            titleEn: articles.titleEn,
            titleAr: articles.titleAr,
            mainImageId: articles.mainImageId,
            richContentId: articles.richContentId,
            authorId: articles.authorId,
            categoryId: articles.categoryId,
            slugEn: articles.slugEn,
            slugAr: articles.slugAr,
            publishedAt: articles.publishedAt,
            createdAt: articles.createdAt,
            updatedAt: articles.updatedAt,
            category: {
                id: articleCategories.id,
                titleEn: articleCategories.titleEn,
                titleAr: articleCategories.titleAr,
            },
            author: {
                id: authors.id,
                publicNameEn: authors.publicNameEn,
                publicNameAr: authors.publicNameAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
            richContent: {
                id: richContents.id,
                contentEn: richContents.contentEn,
                contentAr: richContents.contentAr,
            },
        })
        .from(articles)
        .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
        .leftJoin(authors, eq(articles.authorId, authors.id))
        .leftJoin(images, eq(articles.mainImageId, images.id))
        .leftJoin(richContents, eq(articles.richContentId, richContents.id))
        .where(eq(articles.id, id))
        .limit(1);

    if (result.length === 0) return null;

    const article = result[0];

    const articleImgs = await db
        .select({ id: images.id, url: images.url })
        .from(articleImages)
        .innerJoin(images, eq(articleImages.imageId, images.id))
        .where(eq(articleImages.articleId, id));

    return {
        ...article,
        category: article.category?.id ? article.category : null,
        author: article.author?.id ? article.author : null,
        mainImage: article.mainImage?.id ? article.mainImage : null,
        richContent: article.richContent?.id ? article.richContent : null,
        images: articleImgs,
    };
}

export async function createArticle(data: {
    titleEn: string;
    titleAr: string;
    slugEn: string;
    slugAr: string;
    categoryId?: string | null;
    authorId?: string | null;
    mainImageId?: string | null;
    contentEn?: string;
    contentAr?: string;
    imageIds?: string[];
    publishedAt?: Date | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const articleId = nanoid();

        // Create rich content if provided
        let richContentId: string | null = null;
        if (data.contentEn || data.contentAr) {
            richContentId = nanoid();
            await db.insert(richContents).values({
                id: richContentId,
                contentEn: data.contentEn || null,
                contentAr: data.contentAr || null,
            });
        }

        // Create article
        await db.insert(articles).values({
            id: articleId,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            categoryId: data.categoryId || null,
            authorId: data.authorId || null,
            mainImageId: data.mainImageId || null,
            richContentId,
            publishedAt: data.publishedAt || null,
        });

        // Insert article images
        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(articleImages).values({ articleId, imageId }).onConflictDoNothing()
                )
            );
        }

        return { success: true, message: "Article created", id: articleId };
    } catch (error) {
        console.error("Error creating article:", error);
        return { success: false, message: "Failed to create article" };
    }
}

export async function updateArticle(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        slugEn: string;
        slugAr: string;
        categoryId?: string | null;
        authorId?: string | null;
        mainImageId?: string | null;
        contentEn?: string;
        contentAr?: string;
        imageIds?: string[];
        publishedAt?: Date | null;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        // Get existing article to check for richContentId
        const existing = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
        if (existing.length === 0) {
            return { success: false, message: "Article not found" };
        }

        let richContentId = existing[0].richContentId;

        // Update or create rich content
        if (data.contentEn || data.contentAr) {
            if (richContentId) {
                await db.update(richContents).set({
                    contentEn: data.contentEn || null,
                    contentAr: data.contentAr || null,
                }).where(eq(richContents.id, richContentId));
            } else {
                richContentId = nanoid();
                await db.insert(richContents).values({
                    id: richContentId,
                    contentEn: data.contentEn || null,
                    contentAr: data.contentAr || null,
                });
            }
        }

        // Update article
        await db.update(articles).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            categoryId: data.categoryId || null,
            authorId: data.authorId || null,
            mainImageId: data.mainImageId || null,
            richContentId,
            publishedAt: data.publishedAt || null,
        }).where(eq(articles.id, id));

        // Update article images
        await db.delete(articleImages).where(eq(articleImages.articleId, id));

        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(articleImages).values({ articleId: id, imageId }).onConflictDoNothing()
                )
            );
        }

        return { success: true, message: "Article updated" };
    } catch (error) {
        console.error("Error updating article:", error);
        return { success: false, message: "Failed to update article" };
    }
}

export async function deleteArticle(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(articles).where(eq(articles.id, id));
        return { success: true, message: "Article deleted" };
    } catch (error) {
        console.error("Error deleting article:", error);
        return { success: false, message: "Failed to delete article" };
    }
}
