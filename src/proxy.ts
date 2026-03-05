import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isStaticAssetRequest =
        pathname.startsWith("/_next") ||
        pathname.startsWith("/_vercel") ||
        pathname.includes("/_next/") ||
        pathname.includes("/_vercel/") ||
        /\.[^/]+$/.test(pathname);

    // Skip middleware for admin routes and design variant routes (no i18n)
    if (
        isStaticAssetRequest ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api") ||
        /^\/(?:p|s)?(?:10|[1-9])(\/|$)/.test(pathname)
    ) {
        return NextResponse.next();
    }

    // Apply internationalization middleware
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - ... if they start with `/api`, `/_next` or `/_vercel`
        // - ... the ones containing a dot (e.g. `favicon.ico`)
        "/((?!api|_next|_vercel|admin|.*\\..*).*)",
    ],
};
