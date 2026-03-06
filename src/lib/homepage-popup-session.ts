export const HOMEPAGE_POPUP_DISMISSED_SESSION_KEY = "homepage-popup-dismissed";
export const HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE = "1";

type SessionStorageReader = Pick<Storage, "getItem"> | null | undefined;
type SessionStorageWriter = Pick<Storage, "setItem"> | null | undefined;

export function isHomepagePopupDismissedForSession(
    storage: SessionStorageReader
): boolean {
    if (!storage) {
        return false;
    }

    try {
        return (
            storage.getItem(HOMEPAGE_POPUP_DISMISSED_SESSION_KEY) ===
            HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE
        );
    } catch {
        return false;
    }
}

export function markHomepagePopupDismissedForSession(
    storage: SessionStorageWriter
): void {
    if (!storage) {
        return;
    }

    try {
        storage.setItem(
            HOMEPAGE_POPUP_DISMISSED_SESSION_KEY,
            HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE
        );
    } catch {
        // Ignore storage failures (private mode/blocked storage).
    }
}
