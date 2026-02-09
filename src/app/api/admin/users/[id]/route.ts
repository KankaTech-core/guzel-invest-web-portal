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
        return {
            session: null,
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.role !== Role.ADMIN) {
        return {
            session: null,
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { session, error: null };
};

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { session, error } = await ensureAdminSession();
        if (error || !session) return error;

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Geçersiz kullanıcı" }, { status: 400 });
        }

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
            role?: unknown;
            password?: unknown;
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

        if (!email || !EMAIL_PATTERN.test(email)) {
            return NextResponse.json(
                { error: "Geçerli bir e-posta adresi giriniz" },
                { status: 400 }
            );
        }

        if (!isValidRole(role)) {
            return NextResponse.json(
                { error: "Geçersiz kullanıcı rolü" },
                { status: 400 }
            );
        }

        if (password && password.length < PASSWORD_MIN_LENGTH) {
            return NextResponse.json(
                { error: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır` },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        const existingWithEmail = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingWithEmail && existingWithEmail.id !== id) {
            return NextResponse.json(
                { error: "Bu e-posta başka bir kullanıcı tarafından kullanılıyor" },
                { status: 409 }
            );
        }

        const isDemotingSelfFromAdmin =
            session.userId === id && user.role === Role.ADMIN && role !== Role.ADMIN;
        if (isDemotingSelfFromAdmin) {
            return NextResponse.json(
                { error: "Kendi admin rolünüzü kaldıramazsınız" },
                { status: 400 }
            );
        }

        if (user.role === Role.ADMIN && role !== Role.ADMIN) {
            const adminCount = await prisma.user.count({
                where: { role: Role.ADMIN },
            });
            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: "Sistemde en az bir admin kullanıcı kalmalıdır" },
                    { status: 400 }
                );
            }
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                ...(passwordHash ? { passwordHash } : {}),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            user: updatedUser,
            message: "Kullanıcı güncellendi",
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Kullanıcı güncellenemedi" },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { session, error } = await ensureAdminSession();
        if (error || !session) return error;

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Geçersiz kullanıcı" }, { status: 400 });
        }

        if (session.userId === id) {
            return NextResponse.json(
                { error: "Kendi hesabınızı silemezsiniz" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        if (user.role === Role.ADMIN) {
            const adminCount = await prisma.user.count({
                where: { role: Role.ADMIN },
            });
            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: "Sistemde en az bir admin kullanıcı kalmalıdır" },
                    { status: 400 }
                );
            }
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Kullanıcı silindi" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Kullanıcı silinemedi" },
            { status: 500 }
        );
    }
}
