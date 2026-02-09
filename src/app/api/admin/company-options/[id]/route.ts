import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_COMPANY = "Güzel Invest";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE /api/admin/company-options/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        const option = await prisma.listingCompanyOption.findUnique({
            where: { id },
        });
        if (!option) {
            return NextResponse.json(
                { error: "Company option not found" },
                { status: 404 }
            );
        }

        await prisma.listingCompanyOption.delete({
            where: { id },
        });

        const count = await prisma.listingCompanyOption.count();
        if (count === 0) {
            await prisma.listingCompanyOption.create({
                data: { name: DEFAULT_COMPANY },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting company option:", error);
        return NextResponse.json(
            { error: "Failed to delete company option" },
            { status: 500 }
        );
    }
}
