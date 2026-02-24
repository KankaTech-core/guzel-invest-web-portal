import assert from "node:assert/strict";
import test from "node:test";

import {
    formatPhoneNational,
    isPhoneInputValid,
    normalizePhoneDigits,
    toE164Phone,
} from "./phone-number";

test("normalizePhoneDigits strips non-digit characters", () => {
    assert.equal(normalizePhoneDigits("(555) 123-45 67"), "5551234567");
});

test("formatPhoneNational applies country-aware formatting for Turkey", () => {
    assert.equal(formatPhoneNational("5551234567", "TR"), "555 123 45 67");
});

test("isPhoneInputValid validates phone using selected country code", () => {
    assert.equal(isPhoneInputValid("555 123 45 67", "TR"), true);
    assert.equal(isPhoneInputValid("123", "TR"), false);
});

test("toE164Phone returns normalized international number", () => {
    assert.equal(toE164Phone("555 123 45 67", "TR"), "+905551234567");
});
