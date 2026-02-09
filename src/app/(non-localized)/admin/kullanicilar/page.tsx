import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsersManagement } from "@/components/admin/users-management";

export default async function AdminUsersPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role !== Role.ADMIN) {
        redirect("/admin");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    const serializedUsers = users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
    }));

    return <UsersManagement initialUsers={serializedUsers} />;
}
