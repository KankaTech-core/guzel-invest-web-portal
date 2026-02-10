import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

function normalizeOrigin(value?: string | null): string | null {
    if (!value) return null;
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

function buildForwardedOrigin(request: Request): string | null {
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || request.headers.get("host")?.split(",")[0]?.trim();

    if (!host) return null;

    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProto || new URL(request.url).protocol.replace(":", "");

    return normalizeOrigin(`${protocol}://${host}`);
}

function isLocalhost(origin: string): boolean {
    try {
        const { hostname } = new URL(origin);
        return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
        return false;
    }
}

function resolveRedirectOrigin(request: Request): string {
    const forwardedOrigin = buildForwardedOrigin(request);
    const configuredOrigin =
        normalizeOrigin(process.env.APP_URL) || normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);
    const requestOrigin = normalizeOrigin(request.url);

    const candidates = [forwardedOrigin, configuredOrigin, requestOrigin].filter(
        (origin): origin is string => Boolean(origin)
    );

    if (process.env.NODE_ENV === "production") {
        const firstNonLocalhost = candidates.find((origin) => !isLocalhost(origin));
        if (firstNonLocalhost) return firstNonLocalhost;
    }

    return candidates[0] || "http://localhost:3000";
}

function buildLoginRedirectUrl(request: Request) {
    return new URL("/admin/login", resolveRedirectOrigin(request));
}

export async function POST(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}

export async function GET(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}
