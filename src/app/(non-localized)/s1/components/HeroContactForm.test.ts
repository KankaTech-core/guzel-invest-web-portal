import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const heroContactFormSource = readFileSync(
    resolve(process.cwd(), "src/app/(non-localized)/s1/components/HeroContactForm.tsx"),
    "utf8"
);

test("HeroContactForm styles the custom PhoneInput with matching class selectors", () => {
    assert.match(heroContactFormSource, /\[&_.phone-input-wrapper\]:!bg-white\/10/);
    assert.match(heroContactFormSource, /\[&_.phone-input-wrapper\]:!border-white\/20/);
    assert.match(heroContactFormSource, /\[&_.phone-input-field\]:!text-white/);
    assert.match(heroContactFormSource, /\[&_.phone-input-code\]:!text-white/);
});
