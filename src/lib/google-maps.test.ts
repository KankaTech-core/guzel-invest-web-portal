import assert from "node:assert/strict";
import test from "node:test";

import {
    expandGoogleMapsShortLink,
    extractCoordinatesFromGoogleMapsLink,
    normalizeGoogleMapsLink,
    resolveGoogleMapsLink,
    toGoogleMapsEmbedLink,
} from "./google-maps";

test("toGoogleMapsEmbedLink converts standard Google Maps URLs to embed format", () => {
    const result = toGoogleMapsEmbedLink(
        "https://www.google.com/maps?q=36.5489,32.0489"
    );

    assert.equal(
        result,
        "https://www.google.com/maps?q=36.5489,32.0489&z=15&output=embed"
    );
});

test("toGoogleMapsEmbedLink converts place links with coordinates to canonical embed", () => {
    const result = toGoogleMapsEmbedLink(
        "https://www.google.com/maps/place/36%C2%B032'55.9%22N+32%C2%B003'35.9%22E/@36.548863,32.059976,17z/data=!3m1!4b1!4m4!3m3!8m2!3d36.548863!4d32.059976?entry=ttu"
    );

    assert.equal(
        result,
        "https://www.google.com/maps?q=36.548863,32.059976&z=15&output=embed"
    );
});

test("toGoogleMapsEmbedLink returns null for short links until they are resolved", () => {
    const result = toGoogleMapsEmbedLink("https://maps.app.goo.gl/1k24YXtUcNxScUq76");
    assert.equal(result, null);
});

test("toGoogleMapsEmbedLink rejects unrelated URLs", () => {
    assert.equal(toGoogleMapsEmbedLink("https://example.com"), null);
});

test("normalizeGoogleMapsLink accepts likely Google Maps URLs", () => {
    assert.equal(
        normalizeGoogleMapsLink("https://maps.app.goo.gl/1k24YXtUcNxScUq76"),
        "https://maps.app.goo.gl/1k24YXtUcNxScUq76"
    );
    assert.equal(
        normalizeGoogleMapsLink("https://www.google.com/maps?q=36.5489,32.0489"),
        "https://www.google.com/maps?q=36.5489,32.0489"
    );
    assert.equal(normalizeGoogleMapsLink("https://example.com"), null);
});

test("extractCoordinatesFromGoogleMapsLink parses coordinates from query and pathname", () => {
    const fromQuery = extractCoordinatesFromGoogleMapsLink(
        "https://www.google.com/maps?q=36.5489,32.0489"
    );
    assert.deepEqual(fromQuery, { latitude: 36.5489, longitude: 32.0489 });

    const fromPath = extractCoordinatesFromGoogleMapsLink(
        "https://www.google.com/maps/place/Test/@36.5489049,32.0599807,20z"
    );
    assert.deepEqual(fromPath, { latitude: 36.5489049, longitude: 32.0599807 });
});

test("expandGoogleMapsShortLink resolves redirect target with injected fetch", async () => {
    const expanded = await expandGoogleMapsShortLink(
        "https://maps.app.goo.gl/1k24YXtUcNxScUq76",
        {
            fetchImpl: async () =>
                Promise.resolve({
                    url: "https://www.google.com/maps/place/Test/@36.5489049,32.0599807,20z",
                }),
        }
    );

    assert.equal(
        expanded,
        "https://www.google.com/maps/place/Test/@36.5489049,32.0599807,20z"
    );
});

test("resolveGoogleMapsLink returns expanded link and parsed coordinates", async () => {
    const resolved = await resolveGoogleMapsLink(
        "https://maps.app.goo.gl/1k24YXtUcNxScUq76",
        {
            fetchImpl: async () =>
                Promise.resolve({
                    url: "https://www.google.com/maps/place/Test/@36.5489049,32.0599807,20z",
                }),
        }
    );

    assert.deepEqual(resolved, {
        link: "https://www.google.com/maps/place/Test/@36.5489049,32.0599807,20z",
        coordinates: { latitude: 36.5489049, longitude: 32.0599807 },
    });
});
