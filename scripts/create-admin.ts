import { PrismaClient, Role } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin(email?: string, password?: string) {
    const adminEmail = email || process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = password || process.env.INITIAL_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
        console.error("Or set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD env vars.");
        process.exit(1);
    }

    console.log(`🚀 Attempting to create/reset admin user: ${adminEmail}`);

    try {
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const user = await prisma.user.upsert({
            where: { email: adminEmail.toLowerCase() },
            update: {
                passwordHash: passwordHash,
                role: Role.ADMIN,
            },
            create: {
                email: adminEmail.toLowerCase(),
                passwordHash: passwordHash,
                name: "System Admin",
                role: Role.ADMIN,
            },
        });

        console.log("✅ Admin user successfully created/updated!");
        console.log(`Email: ${user.email}`);
        console.log("Role: ADMIN");
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

const args = process.argv.slice(2);
createAdmin(args[0], args[1]);
