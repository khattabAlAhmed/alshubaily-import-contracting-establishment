import { drizzle } from "drizzle-orm/postgres-js";
import { permissions, rolePermissions } from "../src/lib/db/schema/auth-schema";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Hero carousel permissions
const heroPermissions = [
    { id: "perm_hero_view", key: "hero.view", nameEn: "View Hero Carousel", nameAr: "عرض شرائح البانر" },
    { id: "perm_hero_create", key: "hero.create", nameEn: "Create Hero Slides", nameAr: "إنشاء شرائح البانر" },
    { id: "perm_hero_edit", key: "hero.edit", nameEn: "Edit Hero Slides", nameAr: "تعديل شرائح البانر" },
    { id: "perm_hero_delete", key: "hero.delete", nameEn: "Delete Hero Slides", nameAr: "حذف شرائح البانر" },
];

// Role permission assignments
const rolePermissionMappings = {
    role_admin: ["hero.view", "hero.create", "hero.edit", "hero.delete"],
    role_editor: ["hero.view", "hero.create", "hero.edit"],
    role_author: ["hero.view", "hero.create", "hero.edit"],
    role_viewer: ["hero.view"],
};

async function seedHeroPermissions() {
    console.log("🔐 Seeding hero carousel permissions...");

    // Insert permissions (skip if already exists)
    for (const perm of heroPermissions) {
        try {
            await db.insert(permissions).values(perm).onConflictDoNothing();
            console.log(`  ✓ Permission: ${perm.key}`);
        } catch (error) {
            console.log(`  ⚠ Permission ${perm.key} may already exist`);
        }
    }

    // Assign permissions to roles
    console.log("\n📋 Assigning permissions to roles...");

    for (const [roleId, permKeys] of Object.entries(rolePermissionMappings)) {
        for (const permKey of permKeys) {
            const perm = heroPermissions.find(p => p.key === permKey);
            if (perm) {
                try {
                    await db.insert(rolePermissions).values({
                        roleId,
                        permissionId: perm.id,
                    }).onConflictDoNothing();
                    console.log(`  ✓ ${roleId} → ${permKey}`);
                } catch (error) {
                    console.log(`  ⚠ ${roleId} → ${permKey} may already exist`);
                }
            }
        }
    }

    console.log("\n✅ Hero carousel permissions seeded successfully!");
}

seedHeroPermissions()
    .catch((error) => {
        console.error("❌ Error seeding hero permissions:", error);
        process.exit(1);
    })
    .finally(() => {
        client.end();
        process.exit(0);
    });
