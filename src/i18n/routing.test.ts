import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { locales, routing } from "@/i18n/routing";
import { publicLocales } from "@/i18n/public-locales";

test("routing exposes Turkish, English, Russian and German as the public locale set", () => {
    assert.deepEqual(locales, publicLocales);
    assert.equal(routing.defaultLocale, "en");
});

test("proxy redirects the root path to the browser's preferred locale", () => {
    const request = new NextRequest("https://example.com/", {
        headers: {
            "accept-language": "en-US,en;q=0.9",
        },
    });

    const response = proxy(request);

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/en");
});

test("proxy falls back to /en when the browser language is unsupported", () => {
    const request = new NextRequest("https://example.com/", {
        headers: {
            "accept-language": "ja-JP,ja;q=0.9",
        },
    });

    const response = proxy(request);

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/en");
});

test("proxy redirects to /tr when the browser prefers Turkish", () => {
    const request = new NextRequest("https://example.com/", {
        headers: {
            "accept-language": "tr-TR,tr;q=0.9",
        },
    });

    const response = proxy(request);

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/tr");
});
