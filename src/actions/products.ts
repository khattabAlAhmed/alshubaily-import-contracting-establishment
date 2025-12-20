"use server";

import { db } from "@/lib/db/drizzle";
import {
    productCategories,
    propertyCategories,
    properties,
    products,
    productImages,
    productDetails,
} from "@/lib/db/schema/products-schema";
import { images } from "@/lib/db/schema/images-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// ==================== Types ====================

export type ProductCategory = typeof productCategories.$inferSelect;
export type PropertyCategory = typeof propertyCategories.$inferSelect;
export type Property = typeof properties.$inferSelect & {
    category?: { id: string; titleEn: string; titleAr: string } | null;
};
export type Product = typeof products.$inferSelect;
export type ProductDetail = typeof productDetails.$inferSelect;

export type ProductWithRelations = Product & {
    category?: { id: string; titleEn: string; titleAr: string } | null;
    mainImage?: { id: string; url: string } | null;
    images: { id: string; url: string }[];
};

// ==================== Product Categories ====================

export async function getAllProductCategories(): Promise<ProductCategory[]> {
    return db.select().from(productCategories).orderBy(productCategories.titleEn);
}

export async function createProductCategory(data: {
    titleEn: string;
    titleAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(productCategories).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
        });
        return { success: true, message: "Product category created", id };
    } catch (error) {
        console.error("Error creating product category:", error);
        return { success: false, message: "Failed to create product category" };
    }
}

export async function updateProductCategory(
    id: string,
    data: { titleEn: string; titleAr: string; descriptionEn?: string; descriptionAr?: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(productCategories).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
        }).where(eq(productCategories.id, id));
        return { success: true, message: "Product category updated" };
    } catch (error) {
        console.error("Error updating product category:", error);
        return { success: false, message: "Failed to update product category" };
    }
}

export async function deleteProductCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(productCategories).where(eq(productCategories.id, id));
        return { success: true, message: "Product category deleted" };
    } catch (error) {
        console.error("Error deleting product category:", error);
        return { success: false, message: "Failed to delete product category" };
    }
}

// ==================== Property Categories ====================

export async function getAllPropertyCategories(): Promise<PropertyCategory[]> {
    return db.select().from(propertyCategories).orderBy(propertyCategories.titleEn);
}

export async function createPropertyCategory(data: {
    titleEn: string;
    titleAr: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(propertyCategories).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
        });
        return { success: true, message: "Property category created", id };
    } catch (error) {
        console.error("Error creating property category:", error);
        return { success: false, message: "Failed to create property category" };
    }
}

export async function updatePropertyCategory(
    id: string,
    data: { titleEn: string; titleAr: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(propertyCategories).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
        }).where(eq(propertyCategories.id, id));
        return { success: true, message: "Property category updated" };
    } catch (error) {
        console.error("Error updating property category:", error);
        return { success: false, message: "Failed to update property category" };
    }
}

export async function deletePropertyCategory(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(propertyCategories).where(eq(propertyCategories.id, id));
        return { success: true, message: "Property category deleted" };
    } catch (error) {
        console.error("Error deleting property category:", error);
        return { success: false, message: "Failed to delete property category" };
    }
}

// ==================== Properties ====================

export async function getAllProperties(): Promise<Property[]> {
    const result = await db
        .select({
            id: properties.id,
            titleEn: properties.titleEn,
            titleAr: properties.titleAr,
            categoryId: properties.categoryId,
            createdAt: properties.createdAt,
            updatedAt: properties.updatedAt,
            category: {
                id: propertyCategories.id,
                titleEn: propertyCategories.titleEn,
                titleAr: propertyCategories.titleAr,
            },
        })
        .from(properties)
        .leftJoin(propertyCategories, eq(properties.categoryId, propertyCategories.id))
        .orderBy(properties.titleEn);

    return result.map(r => ({
        ...r,
        category: r.category?.id ? r.category : null,
    }));
}

export async function createProperty(data: {
    titleEn: string;
    titleAr: string;
    categoryId?: string | null;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(properties).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            categoryId: data.categoryId || null,
        });
        return { success: true, message: "Property created", id };
    } catch (error) {
        console.error("Error creating property:", error);
        return { success: false, message: "Failed to create property" };
    }
}

export async function updateProperty(
    id: string,
    data: { titleEn: string; titleAr: string; categoryId?: string | null }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(properties).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            categoryId: data.categoryId || null,
        }).where(eq(properties.id, id));
        return { success: true, message: "Property updated" };
    } catch (error) {
        console.error("Error updating property:", error);
        return { success: false, message: "Failed to update property" };
    }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(properties).where(eq(properties.id, id));
        return { success: true, message: "Property deleted" };
    } catch (error) {
        console.error("Error deleting property:", error);
        return { success: false, message: "Failed to delete property" };
    }
}

// ==================== Products ====================

export async function getAllProducts(): Promise<ProductWithRelations[]> {
    const result = await db
        .select({
            id: products.id,
            titleEn: products.titleEn,
            titleAr: products.titleAr,
            mainImageId: products.mainImageId,
            descriptionEn: products.descriptionEn,
            descriptionAr: products.descriptionAr,
            categoryId: products.categoryId,
            slugEn: products.slugEn,
            slugAr: products.slugAr,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            category: {
                id: productCategories.id,
                titleEn: productCategories.titleEn,
                titleAr: productCategories.titleAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .leftJoin(images, eq(products.mainImageId, images.id))
        .orderBy(products.createdAt);

    // Fetch product images for each product
    const productsWithImages: ProductWithRelations[] = await Promise.all(
        result.map(async (p) => {
            const productImgs = await db
                .select({ id: images.id, url: images.url })
                .from(productImages)
                .innerJoin(images, eq(productImages.imageId, images.id))
                .where(eq(productImages.productId, p.id));

            return {
                ...p,
                category: p.category?.id ? p.category : null,
                mainImage: p.mainImage?.id ? p.mainImage : null,
                images: productImgs,
            };
        })
    );

    return productsWithImages;
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
    const result = await db
        .select({
            id: products.id,
            titleEn: products.titleEn,
            titleAr: products.titleAr,
            mainImageId: products.mainImageId,
            descriptionEn: products.descriptionEn,
            descriptionAr: products.descriptionAr,
            categoryId: products.categoryId,
            slugEn: products.slugEn,
            slugAr: products.slugAr,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            category: {
                id: productCategories.id,
                titleEn: productCategories.titleEn,
                titleAr: productCategories.titleAr,
            },
            mainImage: {
                id: images.id,
                url: images.url,
            },
        })
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .leftJoin(images, eq(products.mainImageId, images.id))
        .where(eq(products.id, id))
        .limit(1);

    if (result.length === 0) return null;

    const product = result[0];

    const productImgs = await db
        .select({ id: images.id, url: images.url })
        .from(productImages)
        .innerJoin(images, eq(productImages.imageId, images.id))
        .where(eq(productImages.productId, id));

    return {
        ...product,
        category: product.category?.id ? product.category : null,
        mainImage: product.mainImage?.id ? product.mainImage : null,
        images: productImgs,
    };
}

export async function createProduct(data: {
    titleEn: string;
    titleAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    slugEn: string;
    slugAr: string;
    categoryId?: string | null;
    mainImageId?: string | null;
    imageIds?: string[];
    details?: { propertyId: string; valueEn: string; valueAr: string }[];
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();

        await db.insert(products).values({
            id,
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            categoryId: data.categoryId || null,
            mainImageId: data.mainImageId || null,
        });

        // Insert product images
        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(productImages).values({ productId: id, imageId }).onConflictDoNothing()
                )
            );
        }

        // Insert product details
        if (data.details && data.details.length > 0) {
            await Promise.all(
                data.details.map(detail =>
                    db.insert(productDetails).values({
                        id: nanoid(),
                        productId: id,
                        propertyId: detail.propertyId,
                        valueEn: detail.valueEn || null,
                        valueAr: detail.valueAr || null,
                    })
                )
            );
        }

        return { success: true, message: "Product created", id };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, message: "Failed to create product" };
    }
}

export async function updateProduct(
    id: string,
    data: {
        titleEn: string;
        titleAr: string;
        descriptionEn?: string;
        descriptionAr?: string;
        slugEn: string;
        slugAr: string;
        categoryId?: string | null;
        mainImageId?: string | null;
        imageIds?: string[];
        details?: { propertyId: string; valueEn: string; valueAr: string }[];
    }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(products).set({
            titleEn: data.titleEn,
            titleAr: data.titleAr,
            descriptionEn: data.descriptionEn || null,
            descriptionAr: data.descriptionAr || null,
            slugEn: data.slugEn,
            slugAr: data.slugAr,
            categoryId: data.categoryId || null,
            mainImageId: data.mainImageId || null,
        }).where(eq(products.id, id));

        // Update product images
        await db.delete(productImages).where(eq(productImages.productId, id));

        if (data.imageIds && data.imageIds.length > 0) {
            await Promise.all(
                data.imageIds.map(imageId =>
                    db.insert(productImages).values({ productId: id, imageId }).onConflictDoNothing()
                )
            );
        }

        // Update product details - delete existing and insert new
        await db.delete(productDetails).where(eq(productDetails.productId, id));

        if (data.details && data.details.length > 0) {
            await Promise.all(
                data.details.map(detail =>
                    db.insert(productDetails).values({
                        id: nanoid(),
                        productId: id,
                        propertyId: detail.propertyId,
                        valueEn: detail.valueEn || null,
                        valueAr: detail.valueAr || null,
                    })
                )
            );
        }

        return { success: true, message: "Product updated" };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: "Failed to update product" };
    }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(products).where(eq(products.id, id));
        return { success: true, message: "Product deleted" };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, message: "Failed to delete product" };
    }
}

// ==================== Product Details ====================

export async function getProductDetails(productId: string): Promise<(ProductDetail & { property: { id: string; titleEn: string; titleAr: string } })[]> {
    const result = await db
        .select({
            id: productDetails.id,
            productId: productDetails.productId,
            propertyId: productDetails.propertyId,
            valueEn: productDetails.valueEn,
            valueAr: productDetails.valueAr,
            createdAt: productDetails.createdAt,
            updatedAt: productDetails.updatedAt,
            property: {
                id: properties.id,
                titleEn: properties.titleEn,
                titleAr: properties.titleAr,
            },
        })
        .from(productDetails)
        .innerJoin(properties, eq(productDetails.propertyId, properties.id))
        .where(eq(productDetails.productId, productId));

    return result;
}

export async function createProductDetail(data: {
    productId: string;
    propertyId: string;
    valueEn?: string;
    valueAr?: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
    try {
        const id = nanoid();
        await db.insert(productDetails).values({
            id,
            productId: data.productId,
            propertyId: data.propertyId,
            valueEn: data.valueEn || null,
            valueAr: data.valueAr || null,
        });
        return { success: true, message: "Product detail created", id };
    } catch (error) {
        console.error("Error creating product detail:", error);
        return { success: false, message: "Failed to create product detail" };
    }
}

export async function updateProductDetail(
    id: string,
    data: { valueEn?: string; valueAr?: string }
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(productDetails).set({
            valueEn: data.valueEn || null,
            valueAr: data.valueAr || null,
        }).where(eq(productDetails.id, id));
        return { success: true, message: "Product detail updated" };
    } catch (error) {
        console.error("Error updating product detail:", error);
        return { success: false, message: "Failed to update product detail" };
    }
}

export async function deleteProductDetail(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(productDetails).where(eq(productDetails.id, id));
        return { success: true, message: "Product detail deleted" };
    } catch (error) {
        console.error("Error deleting product detail:", error);
        return { success: false, message: "Failed to delete product detail" };
    }
}
