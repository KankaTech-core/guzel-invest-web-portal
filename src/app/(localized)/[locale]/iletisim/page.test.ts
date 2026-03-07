import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const contactPageSource = readFileSync(
    resolve(process.cwd(), "src/app/(localized)/[locale]/iletisim/page.tsx"),
    "utf8"
);

test("Contact page keeps the primary CTA and form ahead of secondary contact details on mobile", () => {
    assert.match(contactPageSource, /className="mt-1 block whitespace-pre-line break-all text-sm font-semibold text-gray-900 transition-colors hover:text-orange-500"/);
    assert.match(contactPageSource, /className="order-2 lg:order-1 lg:col-span-5"/);
    assert.match(contactPageSource, /className="order-1 flex flex-col lg:order-2 lg:col-span-7"/);
    assert.match(contactPageSource, /className="mb-6 lg:hidden"/);
    assert.match(contactPageSource, /className="hidden lg:block"/);
    assert.match(contactPageSource, /className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2"/);
    assert.match(contactPageSource, /className="overflow-hidden rounded-2xl border border-gray-200 bg-white"/);
});
