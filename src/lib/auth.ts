import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@/generated/prisma";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-change-in-production"
);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    exp?: number;
    iat?: number;
}

export async function createToken(payload: Omit<JWTPayload, "exp" | "iat">): Promise<string> {
    const token = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);

    return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        return null;
    }

    return {
        ...payload,
        userId: user.id,
        email: user.email,
        role: user.role,
    };
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });

    return user;
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
    const roleHierarchy: Record<Role, number> = {
        VIEWER: 1,
        EDITOR: 2,
        ADMIN: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
