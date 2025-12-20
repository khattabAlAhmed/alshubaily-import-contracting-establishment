import { drizzle } from "drizzle-orm/postgres-js";
import { partners } from "../src/lib/db/schema/partners-schema";
import { nanoid } from "nanoid";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Mock partners data
const partnersData = [
    {
        id: nanoid(),
        nameEn: "Saudi Aramco",
        nameAr: "أرامكو السعودية",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "SABIC",
        nameAr: "سابك",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Ma'aden",
        nameAr: "معادن",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Saudi Electricity Company",
        nameAr: "الشركة السعودية للكهرباء",
        logoImageId: null,
    },
    {
        id: nanoid(),
        nameEn: "Riyadh Municipality",
        nameAr: "أمانة منطقة الرياض",
        logoImageId: null,
    },
];

async function main() {
    console.log("Seeding partners...\n");

    for (const partner of partnersData) {
        await db.insert(partners).values(partner).onConflictDoNothing();
        console.log(`✓ Partner seeded: ${partner.nameEn}`);
    }

    console.log("\n✅ Partners seeded successfully!");
    await client.end();
}

main().catch((err) => {
    console.error("Error seeding partners:", err);
    process.exit(1);
});
