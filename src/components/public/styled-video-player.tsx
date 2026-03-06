"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type PlayButtonPlacement = "center" | "corner";

interface StyledVideoPlayerProps {
    src: string;
    title: string;
    autoPlay?: boolean;
    loop?: boolean;
    mutedByDefault?: boolean;
    unmuteOnPlay?: boolean;
    playButtonPlacement?: PlayButtonPlacement;
    toggleOnVideoClick?: boolean;
    showPlayButtonOnlyWhenPaused?: boolean;
    className?: string;
}

export function StyledVideoPlayer({
    src,
    title,
    autoPlay = false,
    loop = false,
    mutedByDefault = false,
    unmuteOnPlay = false,
    playButtonPlacement = "corner",
    toggleOnVideoClick = false,
    showPlayButtonOnlyWhenPaused = false,
    className,
}: StyledVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
    const [isMuted, setIsMuted] = useState(Boolean(mutedByDefault));

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = mutedByDefault;
        setIsMuted(video.muted);

        if (!autoPlay) {
            video.pause();
            setIsPlaying(false);
            return;
        }

        void video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    }, [autoPlay, mutedByDefault, src]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            if (unmuteOnPlay && video.muted) {
                video.muted = false;
                setIsMuted(false);
            }
            void video
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            return;
        }

        video.pause();
        setIsPlaying(false);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const shouldShowPlayButton = showPlayButtonOnlyWhenPaused ? !isPlaying : true;

    return (
        <div className={cn("relative h-full w-full", className)}>
            <video
                ref={videoRef}
                src={src}
                playsInline
                loop={loop}
                preload="metadata"
                className={cn(
                    "h-full w-full object-cover",
                    toggleOnVideoClick && "cursor-pointer"
                )}
                onClick={toggleOnVideoClick ? togglePlay : undefined}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {shouldShowPlayButton ? (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        togglePlay();
                    }}
                    className={cn(
                        "z-10 inline-flex items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60",
                        playButtonPlacement === "center"
                            ? "absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                            : "absolute bottom-3 right-14 h-9 w-9"
                    )}
                    aria-label={isPlaying ? "Videoyu durdur" : "Videoyu oynat"}
                >
                    {showPlayButtonOnlyWhenPaused ? (
                        <Play className={playButtonPlacement === "center" ? "h-6 w-6" : "h-4 w-4"} />
                    ) : isPlaying ? (
                        <Pause className={playButtonPlacement === "center" ? "h-6 w-6" : "h-4 w-4"} />
                    ) : (
                        <Play className={playButtonPlacement === "center" ? "h-6 w-6" : "h-4 w-4"} />
                    )}
                </button>
            ) : null}

            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    toggleMute();
                }}
                className={cn(
                    "absolute bottom-3 right-3 z-10 inline-flex items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60",
                    playButtonPlacement === "center" ? "h-9 w-9" : "h-9 w-9"
                )}
                aria-label={isMuted ? "Sesi aç" : "Sesi kapat"}
            >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <span className="sr-only">{title}</span>
        </div>
    );
}
