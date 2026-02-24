import assert from "node:assert/strict";
import test from "node:test";

import { phoneCountryOptions } from "./phone-country-options";

test("phoneCountryOptions includes many countries with flag, name and dialing code", () => {
    assert.ok(phoneCountryOptions.length > 150);

    const turkey = phoneCountryOptions.find((option) => option.value === "TR");
    assert.ok(turkey);
    assert.equal(turkey?.flag, "🇹🇷");
    assert.equal(turkey?.callingCode, "+90");
    assert.ok((turkey?.name.length ?? 0) > 0);
});
