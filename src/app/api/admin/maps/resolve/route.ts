import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { resolveGoogleMapsLink } from "@/lib/google-maps";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");
        if (!url || !url.trim()) {
            return NextResponse.json(
                { error: "url query parameter is required" },
                { status: 400 }
            );
        }

        const resolved = await resolveGoogleMapsLink(url);
        if (!resolved) {
            return NextResponse.json(
                { error: "Invalid Google Maps URL" },
                { status: 422 }
            );
        }

        return NextResponse.json({
            link: resolved.link,
            latitude: resolved.coordinates?.latitude ?? null,
            longitude: resolved.coordinates?.longitude ?? null,
        });
    } catch (error) {
        console.error("Failed to resolve Google Maps link:", error);
        return NextResponse.json(
            { error: "Failed to resolve Google Maps link" },
            { status: 500 }
        );
    }
}
