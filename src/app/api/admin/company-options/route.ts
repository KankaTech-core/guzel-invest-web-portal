import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_COMPANY = "Güzel Invest";

const ensureDefaultOption = async () => {
    const count = await prisma.listingCompanyOption.count();
    if (count > 0) return;

    await prisma.listingCompanyOption.create({
        data: {
            name: DEFAULT_COMPANY,
        },
    });
};

// GET /api/admin/company-options - list company dropdown options
export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureDefaultOption();

        const options = await prisma.listingCompanyOption.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ options });
    } catch (error) {
        console.error("Error fetching company options:", error);
        return NextResponse.json(
            { error: "Failed to fetch company options" },
            { status: 500 }
        );
    }
}

// POST /api/admin/company-options - create company option
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const name =
            typeof body?.name === "string" ? body.name.trim() : "";

        if (!name) {
            return NextResponse.json(
                { error: "Company name is required" },
                { status: 400 }
            );
        }

        const existing = await prisma.listingCompanyOption.findUnique({
            where: { name },
        });
        if (existing) {
            return NextResponse.json({ option: existing });
        }

        const option = await prisma.listingCompanyOption.create({
            data: { name },
        });

        return NextResponse.json({ option }, { status: 201 });
    } catch (error) {
        console.error("Error creating company option:", error);
        return NextResponse.json(
            { error: "Failed to create company option" },
            { status: 500 }
        );
    }
}
