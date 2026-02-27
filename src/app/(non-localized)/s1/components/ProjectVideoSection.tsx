"use client";

interface ProjectVideoSectionProps {
    videoUrl: string;
    videoTitle?: string;
}

export const ProjectVideoSection = ({
    videoUrl,
    videoTitle,
}: ProjectVideoSectionProps) => {
    let embedUrl: string | null = null;

    if (
        videoUrl.includes("youtube.com/embed/") ||
        videoUrl.includes("player.vimeo.com/video/")
    ) {
        embedUrl = videoUrl;
    } else {
        const ytMatch = videoUrl.match(
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        );
        if (ytMatch && ytMatch[2].length === 11) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
        } else {
            const vimeoMatch = videoUrl.match(
                /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/
            );
            if (vimeoMatch && vimeoMatch[1]) {
                embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
            }
        }
    }

    return (
        <section className="bg-white py-16 lg:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {videoTitle || "Proje Tanıtım Videosu"}
                    </h2>
                </div>
                <div className="aspect-video overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 shadow-xl shadow-gray-200/50">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={videoTitle || "Tanıtım Videosu"}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            controls
                            preload="metadata"
                            className="h-full w-full object-cover"
                            src={videoUrl}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
