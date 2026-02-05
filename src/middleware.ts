import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for admin routes and design variant routes (no i18n)
    if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api") ||
        /^\/(?:10|[1-9])(\/|$)/.test(pathname)
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
