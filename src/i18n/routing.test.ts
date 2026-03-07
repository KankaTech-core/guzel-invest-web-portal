import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { locales, routing } from "@/i18n/routing";

test("routing exposes only Turkish as the public locale", () => {
    assert.deepEqual(locales, ["tr"]);
    assert.equal(routing.defaultLocale, "tr");
});

test("proxy redirects the root path to /tr even when the browser prefers English", () => {
    const request = new NextRequest("https://example.com/", {
        headers: {
            "accept-language": "en-US,en;q=0.9",
        },
    });

    const response = proxy(request);

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/tr");
});
