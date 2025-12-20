import "dotenv/config";
import { db } from "@/lib/db/drizzle";
import { propertyCategories } from "@/lib/db/schema/products-schema";
import { nanoid } from "nanoid";

const categories = [
    { titleEn: "Dimensions & Measurements", titleAr: "الأبعاد والقياسات" },
    { titleEn: "Quantity & Composition", titleAr: "الكمية والتركيب" },
    { titleEn: "Physical Properties", titleAr: "الخصائص الفيزيائية" },
    { titleEn: "Technical Properties", titleAr: "الخصائص الفنية والتقنية" },
    { titleEn: "Functional Properties", titleAr: "الخصائص الوظيفية" },
    { titleEn: "Health & Safety", titleAr: "الخصائص الصحية والسلامة" },
    { titleEn: "Nutritional Properties", titleAr: "الخصائص الغذائية" },
    { titleEn: "Environmental Properties", titleAr: "الخصائص البيئية" },
    { titleEn: "Commercial Properties", titleAr: "الخصائص التجارية" },
    { titleEn: "Legal & Regulatory", titleAr: "الخصائص القانونية والتنظيمية" },
    { titleEn: "Packaging & Shipping", titleAr: "التغليف والشحن" },
    { titleEn: "Maintenance & Support", titleAr: "الصيانة والدعم" },
    { titleEn: "Digital Properties", titleAr: "الخصائص الرقمية" },
    { titleEn: "Aesthetic & Experience", titleAr: "الخصائص الجمالية والتجربة" },
];

async function seed() {
    console.log("Seeding property categories...");

    for (const category of categories) {
        await db.insert(propertyCategories).values({
            id: nanoid(),
            titleEn: category.titleEn,
            titleAr: category.titleAr,
        }).onConflictDoNothing();
    }

    console.log(`Seeded ${categories.length} property categories`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error seeding property categories:", err);
    process.exit(1);
});
