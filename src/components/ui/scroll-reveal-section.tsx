"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealSectionProps {
    children: ReactNode;
    /** HTML tag to render. Default: "section" */
    as?: "section" | "div" | "article";
    className?: string;
    id?: string;
    /** Intersection Observer threshold. Default: 0.15 */
    threshold?: number;
    /** Root margin for observer. Default: "0px 0px -60px 0px" */
    rootMargin?: string;
}

/**
 * Wraps children in a container that observes `.reveal`, `.reveal-fast`,
 * and `.reveal-scale` descendants – adding `is-visible` once they enter
 * the viewport. Works in Server Component pages via composition.
 */
export function ScrollRevealSection({
    children,
    as: Tag = "section",
    className,
    id,
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
}: ScrollRevealSectionProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin }
        );

        const targets = container.querySelectorAll(
            ".reveal, .reveal-fast, .reveal-scale"
        );
        targets.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <Tag ref={ref as React.RefObject<never>} className={className} id={id}>
            {children}
        </Tag>
    );
}
