import { drizzle } from "drizzle-orm/postgres-js";
import { roles } from "../src/lib/db/schema/auth-schema";
import { nanoid } from "nanoid";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Predefined roles for the application
const rolesData = [
    {
        id: "role_admin",
        nameEn: "Administrator",
        nameAr: "مدير النظام",
        descriptionEn: "Full access to all system features and settings",
        descriptionAr: "وصول كامل لجميع ميزات وإعدادات النظام",
    },
    {
        id: "role_editor",
        nameEn: "Editor",
        nameAr: "محرر",
        descriptionEn: "Can create, edit, and publish content",
        descriptionAr: "يمكنه إنشاء وتحرير ونشر المحتوى",
    },
    {
        id: "role_author",
        nameEn: "Author",
        nameAr: "كاتب",
        descriptionEn: "Can create and edit own content",
        descriptionAr: "يمكنه إنشاء وتحرير المحتوى الخاص به",
    },
    {
        id: "role_viewer",
        nameEn: "Viewer",
        nameAr: "مشاهد",
        descriptionEn: "Can view content in the dashboard",
        descriptionAr: "يمكنه عرض المحتوى في لوحة التحكم",
    },
];

async function main() {
    console.log("Seeding roles...");

    for (const role of rolesData) {
        await db
            .insert(roles)
            .values(role)
            .onConflictDoNothing({ target: roles.id });
        console.log(`✓ Role seeded: ${role.nameEn}`);
    }

    console.log("\n✅ Roles seeded successfully!");
    await client.end();
}

main().catch((err) => {
    console.error("Error seeding roles:", err);
    process.exit(1);
});
