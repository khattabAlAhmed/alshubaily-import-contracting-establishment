import "dotenv/config";
import { db } from "@/lib/db/drizzle";
import { properties, propertyCategories } from "@/lib/db/schema/products-schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

type PropertyData = {
    titleEn: string;
    titleAr: string;
};

const propertiesByCategory: Record<string, PropertyData[]> = {
    "Dimensions & Measurements": [
        { titleEn: "Length", titleAr: "الطول" },
        { titleEn: "Width", titleAr: "العرض" },
        { titleEn: "Height", titleAr: "الارتفاع" },
        { titleEn: "Depth", titleAr: "العمق" },
        { titleEn: "Thickness", titleAr: "السماكة" },
        { titleEn: "Diameter", titleAr: "القطر" },
        { titleEn: "Radius", titleAr: "نصف القطر" },
        { titleEn: "Perimeter", titleAr: "المحيط" },
        { titleEn: "Area", titleAr: "المساحة" },
        { titleEn: "Volume", titleAr: "الحجم" },
        { titleEn: "Capacity", titleAr: "السعة" },
        { titleEn: "Net Weight", titleAr: "الوزن الصافي" },
        { titleEn: "Gross Weight", titleAr: "الوزن الإجمالي" },
        { titleEn: "Density", titleAr: "الكثافة" },
        { titleEn: "Maximum Load", titleAr: "الحمولة القصوى" },
    ],
    "Quantity & Composition": [
        { titleEn: "Quantity", titleAr: "الكمية" },
        { titleEn: "Number of Pieces", titleAr: "عدد القطع" },
        { titleEn: "Number of Units", titleAr: "عدد الوحدات" },
        { titleEn: "Number of Items", titleAr: "عدد الحبات" },
        { titleEn: "Concentration", titleAr: "التركيز" },
        { titleEn: "Percentage", titleAr: "النسبة المئوية" },
        { titleEn: "Composition", titleAr: "التركيبة" },
        { titleEn: "Ingredients", titleAr: "المكونات" },
        { titleEn: "Materials", titleAr: "المواد المصنوع منها" },
        { titleEn: "Material Type", titleAr: "نوع المادة" },
    ],
    "Physical Properties": [
        { titleEn: "Color", titleAr: "اللون" },
        { titleEn: "Shape", titleAr: "الشكل" },
        { titleEn: "Texture", titleAr: "الملمس" },
        { titleEn: "Hardness", titleAr: "الصلابة" },
        { titleEn: "Flexibility", titleAr: "المرونة" },
        { titleEn: "Brittleness", titleAr: "الهشاشة" },
        { titleEn: "Transparency", titleAr: "الشفافية" },
        { titleEn: "Glossiness", titleAr: "اللمعان" },
        { titleEn: "Roughness Level", titleAr: "درجة الخشونة" },
        { titleEn: "Water Resistance", titleAr: "مقاومة الماء" },
        { titleEn: "Heat Resistance", titleAr: "مقاومة الحرارة" },
        { titleEn: "Impact Resistance", titleAr: "مقاومة الصدمات" },
        { titleEn: "Corrosion Resistance", titleAr: "مقاومة التآكل" },
        { titleEn: "Flammability", titleAr: "القابلية للاشتعال" },
    ],
    "Technical Properties": [
        { titleEn: "Power", titleAr: "القدرة" },
        { titleEn: "Voltage", titleAr: "الجهد الكهربائي" },
        { titleEn: "Current", titleAr: "التيار" },
        { titleEn: "Frequency", titleAr: "التردد" },
        { titleEn: "Energy Consumption", titleAr: "استهلاك الطاقة" },
        { titleEn: "Energy Type", titleAr: "نوع الطاقة المستخدمة" },
        { titleEn: "Performance", titleAr: "الأداء" },
        { titleEn: "Speed", titleAr: "السرعة" },
        { titleEn: "Accuracy", titleAr: "الدقة" },
        { titleEn: "Storage Capacity", titleAr: "السعة التخزينية" },
        { titleEn: "Processor", titleAr: "المعالج" },
        { titleEn: "Operating System", titleAr: "نظام التشغيل" },
        { titleEn: "Version", titleAr: "الإصدار" },
        { titleEn: "Compatibility", titleAr: "التوافق" },
        { titleEn: "Communication Protocols", titleAr: "بروتوكولات الاتصال" },
    ],
    "Functional Properties": [
        { titleEn: "Primary Function", titleAr: "الوظيفة الأساسية" },
        { titleEn: "Secondary Functions", titleAr: "الوظائف الثانوية" },
        { titleEn: "Usage Method", titleAr: "طريقة الاستخدام" },
        { titleEn: "Operating Mechanism", titleAr: "آلية التشغيل" },
        { titleEn: "Efficiency Level", titleAr: "مستوى الكفاءة" },
        { titleEn: "Operating Life", titleAr: "عمر التشغيل" },
        { titleEn: "Battery Life", titleAr: "عمر البطارية" },
        { titleEn: "Charging Time", titleAr: "زمن الشحن" },
        { titleEn: "Response Time", titleAr: "زمن الاستجابة" },
    ],
    "Health & Safety": [
        { titleEn: "Safe to Use", titleAr: "آمن للاستخدام" },
        { titleEn: "Health Certified", titleAr: "معتمد صحيًا" },
        { titleEn: "Toxin Free", titleAr: "خالٍ من المواد السامة" },
        { titleEn: "Safety Instructions", titleAr: "تعليمات السلامة" },
        { titleEn: "Warnings", titleAr: "التحذيرات" },
        { titleEn: "Safety Level", titleAr: "درجة الأمان" },
        { titleEn: "Child Safe", titleAr: "مناسب للأطفال" },
        { titleEn: "Allergy Friendly", titleAr: "مناسب للحساسية" },
    ],
    "Nutritional Properties": [
        { titleEn: "Calories", titleAr: "السعرات الحرارية" },
        { titleEn: "Protein", titleAr: "البروتين" },
        { titleEn: "Fats", titleAr: "الدهون" },
        { titleEn: "Carbohydrates", titleAr: "الكربوهيدرات" },
        { titleEn: "Sugars", titleAr: "السكريات" },
        { titleEn: "Salts", titleAr: "الأملاح" },
        { titleEn: "Vitamins", titleAr: "الفيتامينات" },
        { titleEn: "Minerals", titleAr: "المعادن" },
        { titleEn: "Nutritional Value", titleAr: "القيمة الغذائية" },
        { titleEn: "Production Date", titleAr: "تاريخ الإنتاج" },
        { titleEn: "Expiry Date", titleAr: "تاريخ الانتهاء" },
    ],
    "Environmental Properties": [
        { titleEn: "Eco-Friendly", titleAr: "صديق للبيئة" },
        { titleEn: "Recyclable", titleAr: "قابل لإعادة التدوير" },
        { titleEn: "Biodegradable", titleAr: "قابل للتحلل" },
        { titleEn: "Carbon Footprint", titleAr: "البصمة الكربونية" },
        { titleEn: "Resource Consumption", titleAr: "استهلاك الموارد" },
        { titleEn: "Environmental Impact", titleAr: "التأثير البيئي" },
    ],
    "Commercial Properties": [
        { titleEn: "Trade Name", titleAr: "الاسم التجاري" },
        { titleEn: "Brand", titleAr: "العلامة التجارية" },
        { titleEn: "Manufacturer", titleAr: "الشركة المصنعة" },
        { titleEn: "Country of Origin", titleAr: "بلد المنشأ" },
        { titleEn: "Unit Price", titleAr: "سعر الوحدة" },
        { titleEn: "Total Price", titleAr: "السعر الإجمالي" },
        { titleEn: "Currency", titleAr: "العملة" },
        { titleEn: "Offers & Discounts", titleAr: "العروض والخصومات" },
        { titleEn: "Tax", titleAr: "الضريبة" },
        { titleEn: "Shipping Cost", titleAr: "تكلفة الشحن" },
        { titleEn: "Availability", titleAr: "التوافر" },
        { titleEn: "Stock", titleAr: "المخزون" },
    ],
    "Legal & Regulatory": [
        { titleEn: "Model Number", titleAr: "رقم الموديل" },
        { titleEn: "Serial Number", titleAr: "الرقم التسلسلي" },
        { titleEn: "Barcode", titleAr: "الباركود" },
        { titleEn: "Product Code", titleAr: "رمز المنتج" },
        { titleEn: "Certifications", titleAr: "الشهادات" },
        { titleEn: "Licenses", titleAr: "التراخيص" },
        { titleEn: "Specification Compliance", titleAr: "المطابقة للمواصفات" },
        { titleEn: "Quality Standards", titleAr: "معايير الجودة" },
    ],
    "Packaging & Shipping": [
        { titleEn: "Packaging Type", titleAr: "نوع التغليف" },
        { titleEn: "Package Dimensions", titleAr: "أبعاد العبوة" },
        { titleEn: "Package Weight", titleAr: "وزن العبوة" },
        { titleEn: "Package Contents", titleAr: "محتويات العبوة" },
        { titleEn: "Storage Method", titleAr: "طريقة التخزين" },
        { titleEn: "Transport Conditions", titleAr: "شروط النقل" },
        { titleEn: "Fragility", titleAr: "قابلية الكسر" },
    ],
    "Maintenance & Support": [
        { titleEn: "Warranty", titleAr: "الضمان" },
        { titleEn: "Warranty Period", titleAr: "مدة الضمان" },
        { titleEn: "Return Policy", titleAr: "سياسة الإرجاع" },
        { titleEn: "Periodic Maintenance", titleAr: "الصيانة الدورية" },
        { titleEn: "Spare Parts", titleAr: "قطع الغيار" },
        { titleEn: "Technical Support", titleAr: "الدعم الفني" },
        { titleEn: "User Manual", titleAr: "دليل الاستخدام" },
    ],
    "Digital Properties": [
        { titleEn: "File Size", titleAr: "حجم الملف" },
        { titleEn: "File Type", titleAr: "نوع الملف" },
        { titleEn: "License", titleAr: "الترخيص" },
        { titleEn: "Number of Users", titleAr: "عدد المستخدمين" },
        { titleEn: "Subscription Period", titleAr: "مدة الاشتراك" },
        { titleEn: "Updates", titleAr: "التحديثات" },
        { titleEn: "System Compatibility", titleAr: "التوافق مع الأنظمة" },
    ],
    "Aesthetic & Experience": [
        { titleEn: "Design", titleAr: "التصميم" },
        { titleEn: "Style", titleAr: "الطراز" },
        { titleEn: "Aesthetic Appearance", titleAr: "الشكل الجمالي" },
        { titleEn: "Ease of Use", titleAr: "سهولة الاستخدام" },
        { titleEn: "User Experience", titleAr: "تجربة المستخدم" },
        { titleEn: "Target Audience", titleAr: "الفئة المستهدفة" },
    ],
};

async function seed() {
    console.log("Seeding properties...");

    // First, get all property categories
    const allCategories = await db.select().from(propertyCategories);
    const categoryMap = new Map(allCategories.map((c: typeof propertyCategories.$inferSelect) => [c.titleEn, c.id]));

    let totalCount = 0;

    for (const [categoryName, props] of Object.entries(propertiesByCategory)) {
        const categoryId = categoryMap.get(categoryName);

        if (!categoryId) {
            console.warn(`Category not found: ${categoryName}`);
            continue;
        }

        for (const prop of props) {
            await db.insert(properties).values({
                id: nanoid(),
                titleEn: prop.titleEn,
                titleAr: prop.titleAr,
                categoryId,
            }).onConflictDoNothing();
            totalCount++;
        }
    }

    console.log(`Seeded ${totalCount} properties`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error seeding properties:", err);
    process.exit(1);
});
