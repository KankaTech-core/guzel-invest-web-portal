export const HOMEPAGE_POPUP_OPEN_EVENT = "open-homepage-popup";

type GTMPrimitive = string | number | boolean | null;
type GTMPayload = Record<string, GTMPrimitive | undefined>;

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
    }
}

export function pushGTMEvent(event: string, payload: GTMPayload = {}) {
    if (typeof window === "undefined" || !event.trim()) {
        return;
    }

    const normalizedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    );

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
        event,
        ...normalizedPayload,
    });
}

export function dispatchHomepagePopupOpen(source: string) {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(HOMEPAGE_POPUP_OPEN_EVENT, {
            detail: { source },
        })
    );
}
