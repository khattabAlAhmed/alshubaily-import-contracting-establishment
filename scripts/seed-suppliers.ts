import { drizzle } from "drizzle-orm/postgres-js";
import { suppliers } from "../src/lib/db/schema/partners-schema";
import { nanoid } from "nanoid";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Mock suppliers data
const suppliersData = [
    {
        id: nanoid(),
        nameEn: "Caterpillar Inc.",
        nameAr: "كاتربيلر",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Komatsu Ltd.",
        nameAr: "كوماتسو",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Hitachi Construction Machinery",
        nameAr: "هيتاشي للآلات الإنشائية",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Volvo Construction Equipment",
        nameAr: "فولفو للمعدات الإنشائية",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "JCB",
        nameAr: "جي سي بي",
        logoImageId: null,
    },
];

async function main() {
    console.log("Seeding suppliers...\n");

    for (const supplier of suppliersData) {
        await db.insert(suppliers).values(supplier).onConflictDoNothing();
        console.log(`✓ Supplier seeded: ${supplier.nameEn}`);
    }

    console.log("\n✅ Suppliers seeded successfully!");
    await client.end();
}

main().catch((err) => {
    console.error("Error seeding suppliers:", err);
    process.exit(1);
});
