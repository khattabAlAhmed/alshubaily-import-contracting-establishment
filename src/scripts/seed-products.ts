import "dotenv/config";
import { db } from "@/lib/db/drizzle";
import { productCategories, products } from "@/lib/db/schema/products-schema";
import { nanoid } from "nanoid";

const categories = [
    { titleEn: "Construction Materials", titleAr: "مواد البناء", descriptionEn: "Building and construction materials", descriptionAr: "مواد البناء والتشييد" },
    { titleEn: "Electrical Equipment", titleAr: "معدات كهربائية", descriptionEn: "Electrical tools and equipment", descriptionAr: "أدوات ومعدات كهربائية" },
    { titleEn: "Plumbing & Sanitary", titleAr: "السباكة والصحية", descriptionEn: "Plumbing fixtures and sanitary ware", descriptionAr: "تجهيزات السباكة والأدوات الصحية" },
    { titleEn: "Safety Equipment", titleAr: "معدات السلامة", descriptionEn: "Safety and protection equipment", descriptionAr: "معدات السلامة والحماية" },
    { titleEn: "Industrial Machinery", titleAr: "الآلات الصناعية", descriptionEn: "Industrial machines and tools", descriptionAr: "الآلات والأدوات الصناعية" },
];

const sampleProducts = [
    {
        titleEn: "Portland Cement 50kg",
        titleAr: "أسمنت بورتلاند 50 كجم",
        descriptionEn: "High-quality Portland cement for construction projects. Suitable for all types of concrete work.",
        descriptionAr: "أسمنت بورتلاند عالي الجودة لمشاريع البناء. مناسب لجميع أنواع أعمال الخرسانة.",
        slugEn: "portland-cement-50kg",
        slugAr: "اسمنت-بورتلاند-50-كجم",
        categoryIndex: 0,
    },
    {
        titleEn: "Steel Reinforcement Bars",
        titleAr: "قضبان حديد التسليح",
        descriptionEn: "High-strength steel reinforcement bars for concrete structures. Grade 60.",
        descriptionAr: "قضبان حديد تسليح عالية القوة للهياكل الخرسانية. درجة 60.",
        slugEn: "steel-reinforcement-bars",
        slugAr: "قضبان-حديد-التسليح",
        categoryIndex: 0,
    },
    {
        titleEn: "Industrial Power Generator",
        titleAr: "مولد كهرباء صناعي",
        descriptionEn: "Heavy-duty industrial power generator with 500kVA capacity. Diesel powered.",
        descriptionAr: "مولد كهرباء صناعي للأعمال الشاقة بسعة 500 كيلو فولت أمبير. يعمل بالديزل.",
        slugEn: "industrial-power-generator",
        slugAr: "مولد-كهرباء-صناعي",
        categoryIndex: 1,
    },
    {
        titleEn: "Safety Helmet",
        titleAr: "خوذة السلامة",
        descriptionEn: "OSHA-compliant safety helmet with adjustable suspension. Impact resistant.",
        descriptionAr: "خوذة سلامة متوافقة مع معايير OSHA مع تعليق قابل للتعديل. مقاومة للصدمات.",
        slugEn: "safety-helmet",
        slugAr: "خوذة-السلامة",
        categoryIndex: 3,
    },
    {
        titleEn: "Excavator CAT 320",
        titleAr: "حفارة كاتربيلر 320",
        descriptionEn: "Caterpillar 320 excavator with advanced hydraulic system. Ideal for heavy excavation work.",
        descriptionAr: "حفارة كاتربيلر 320 بنظام هيدروليكي متطور. مثالية لأعمال الحفر الثقيلة.",
        slugEn: "excavator-cat-320",
        slugAr: "حفارة-كاتربيلر-320",
        categoryIndex: 4,
    },
];

async function seed() {
    console.log("Seeding product categories...");

    const categoryIds: string[] = [];
    for (const category of categories) {
        const id = nanoid();
        await db.insert(productCategories).values({
            id,
            titleEn: category.titleEn,
            titleAr: category.titleAr,
            descriptionEn: category.descriptionEn,
            descriptionAr: category.descriptionAr,
        }).onConflictDoNothing();
        categoryIds.push(id);
    }

    console.log(`Seeded ${categories.length} product categories`);

    // Get actual category IDs
    const existingCategories = await db.select().from(productCategories);
    const categoryMap = categories.map((c, i) => {
        const found = existingCategories.find(ec => ec.titleEn === c.titleEn);
        return found?.id || categoryIds[i];
    });

    console.log("Seeding products...");

    for (const product of sampleProducts) {
        await db.insert(products).values({
            id: nanoid(),
            titleEn: product.titleEn,
            titleAr: product.titleAr,
            descriptionEn: product.descriptionEn,
            descriptionAr: product.descriptionAr,
            slugEn: product.slugEn,
            slugAr: product.slugAr,
            categoryId: categoryMap[product.categoryIndex],
        }).onConflictDoNothing();
    }

    console.log(`Seeded ${sampleProducts.length} products`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error seeding products:", err);
    process.exit(1);
});
