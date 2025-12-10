import { drizzle } from "drizzle-orm/node-postgres";
import { item } from "../src/lib/db/schema/academy-schema";
import { nanoid } from "nanoid";
import pg from "pg";
import "dotenv/config";

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(client);

// Example seed data - replace with your own data
const items = [
    { nameEn: "Example Item 1", nameAr: "عنصر مثال 1" },
    { nameEn: "Example Item 2", nameAr: "عنصر مثال 2" },
    { nameEn: "Example Item 3", nameAr: "عنصر مثال 3" },
];

async function main() {
    await client.connect();

    console.log(`Seeding ${items.length} items...`);

    for (const itemData of items) {
        await db.insert(item).values({
            id: nanoid(),
            ...itemData,
        });
    }

    console.log("Items seeded successfully!");
    await client.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
