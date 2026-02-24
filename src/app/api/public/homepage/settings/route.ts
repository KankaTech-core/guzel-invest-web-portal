import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomepageHeroVideo } from "@/lib/homepage-video";

export const dynamic = "force-dynamic";

const HOMEPAGE_SETTING_ID = "default";

export async function GET() {
    try {
        const setting = await prisma.homepageSetting.findUnique({
            where: { id: HOMEPAGE_SETTING_ID },
            select: {
                heroVideoUrl: true,
            },
        });

        const video = resolveHomepageHeroVideo(setting?.heroVideoUrl);

        return NextResponse.json({
            video: {
                rawInput: setting?.heroVideoUrl || video.rawInput,
                watchUrl: video.watchUrl,
                autoplayEmbedUrl: video.autoplayEmbedUrl,
                popupEmbedUrl: video.popupEmbedUrl,
                videoId: video.videoId,
            },
        });
    } catch (error) {
        console.error("Public homepage settings API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch homepage settings" },
            { status: 500 }
        );
    }
}
