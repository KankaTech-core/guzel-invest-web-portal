import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

function buildLoginRedirectUrl(request: Request) {
    return new URL("/admin/login", request.url);
}

export async function POST(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}

export async function GET(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}
