"use client";

import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
    /** Fraction of element visible before triggering (0–1). Default: 0.15 */
    threshold?: number;
    /** Extra margin around root. Default: "0px 0px -60px 0px" */
    rootMargin?: string;
}

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When any child with `.reveal`, `.reveal-fast`, or `.reveal-scale`
 * enters the viewport, the `is-visible` class is added (once).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
    options?: UseScrollRevealOptions
) {
    const ref = useRef<T>(null);

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
            {
                threshold: options?.threshold ?? 0.15,
                rootMargin: options?.rootMargin ?? "0px 0px -60px 0px",
            }
        );

        const targets = container.querySelectorAll(
            ".reveal, .reveal-fast, .reveal-scale"
        );
        targets.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [options?.threshold, options?.rootMargin]);

    return ref;
}
