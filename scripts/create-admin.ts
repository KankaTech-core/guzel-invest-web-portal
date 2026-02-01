import { PrismaClient, Role } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin(email: string, password: string) {
    if (!email || !password) {
        console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
        process.exit(1);
    }

    console.log(`🚀 Attempting to create/reset admin user: ${email}`);

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email: email.toLowerCase() },
            update: {
                passwordHash: passwordHash,
                role: Role.ADMIN,
            },
            create: {
                email: email.toLowerCase(),
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
