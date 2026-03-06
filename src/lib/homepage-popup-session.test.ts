import assert from "node:assert/strict";
import test from "node:test";

import {
    HOMEPAGE_POPUP_DISMISSED_SESSION_KEY,
    HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE,
    isHomepagePopupDismissedForSession,
    markHomepagePopupDismissedForSession,
} from "./homepage-popup-session";

test("isHomepagePopupDismissedForSession returns false without storage", () => {
    assert.equal(isHomepagePopupDismissedForSession(undefined), false);
    assert.equal(isHomepagePopupDismissedForSession(null), false);
});

test("isHomepagePopupDismissedForSession returns true only for dismissed marker", () => {
    const dismissedStorage = {
        getItem: (key: string) =>
            key === HOMEPAGE_POPUP_DISMISSED_SESSION_KEY
                ? HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE
                : null,
    };
    const untouchedStorage = {
        getItem: () => null,
    };

    assert.equal(
        isHomepagePopupDismissedForSession(
            dismissedStorage as Pick<Storage, "getItem">
        ),
        true
    );
    assert.equal(
        isHomepagePopupDismissedForSession(
            untouchedStorage as Pick<Storage, "getItem">
        ),
        false
    );
});

test("markHomepagePopupDismissedForSession writes dismissed marker", () => {
    let capturedKey = "";
    let capturedValue = "";
    const storage = {
        setItem: (key: string, value: string) => {
            capturedKey = key;
            capturedValue = value;
        },
    };

    markHomepagePopupDismissedForSession(storage as Pick<Storage, "setItem">);

    assert.equal(capturedKey, HOMEPAGE_POPUP_DISMISSED_SESSION_KEY);
    assert.equal(capturedValue, HOMEPAGE_POPUP_DISMISSED_SESSION_VALUE);
});

test("session helpers swallow storage read/write errors", () => {
    const throwingReadStorage = {
        getItem: () => {
            throw new Error("blocked");
        },
    };
    const throwingWriteStorage = {
        setItem: () => {
            throw new Error("blocked");
        },
    };

    assert.equal(
        isHomepagePopupDismissedForSession(
            throwingReadStorage as Pick<Storage, "getItem">
        ),
        false
    );
    assert.doesNotThrow(() =>
        markHomepagePopupDismissedForSession(
            throwingWriteStorage as Pick<Storage, "setItem">
        )
    );
});
