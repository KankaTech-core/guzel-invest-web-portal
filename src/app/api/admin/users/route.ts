import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PASSWORD_MIN_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_OPTIONS: Role[] = [Role.ADMIN, Role.EDITOR, Role.VIEWER];

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

const isValidRole = (value: unknown): value is Role =>
    typeof value === "string" && ROLE_OPTIONS.includes(value as Role);

const ensureAdminSession = async () => {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
};

export async function GET() {
    try {
        const authError = await ensureAdminSession();
        if (authError) return authError;

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

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Kullanıcılar alınamadı" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authError = await ensureAdminSession();
        if (authError) return authError;

        let parsedBody: unknown;
        try {
            parsedBody = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi" },
                { status: 400 }
            );
        }

        if (!parsedBody || typeof parsedBody !== "object") {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi" },
                { status: 400 }
            );
        }

        const body = parsedBody as {
            name?: unknown;
            email?: unknown;
            password?: unknown;
            role?: unknown;
        };

        const name = typeof body.name === "string" ? normalizeName(body.name) : "";
        const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
        const password =
            typeof body.password === "string" ? body.password.trim() : "";
        const role = body.role;

        if (!name) {
            return NextResponse.json(
                { error: "Ad soyad zorunludur" },
                { status: 400 }
            );
        }

        if (!email) {
            return NextResponse.json(
                { error: "E-posta zorunludur" },
                { status: 400 }
            );
        }

        if (!EMAIL_PATTERN.test(email)) {
            return NextResponse.json(
                { error: "Geçerli bir e-posta adresi giriniz" },
                { status: 400 }
            );
        }

        if (!password || password.length < PASSWORD_MIN_LENGTH) {
            return NextResponse.json(
                { error: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır` },
                { status: 400 }
            );
        }

        if (!isValidRole(role)) {
            return NextResponse.json(
                { error: "Geçersiz kullanıcı rolü" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu e-posta ile kayıtlı bir kullanıcı zaten var" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { user, message: "Kullanıcı başarıyla oluşturuldu" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Kullanıcı oluşturulamadı" },
            { status: 500 }
        );
    }
}
