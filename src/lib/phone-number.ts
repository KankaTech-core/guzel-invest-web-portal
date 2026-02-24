import {
    AsYouType,
    parsePhoneNumberFromString,
    type CountryCode,
} from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";

export function normalizePhoneDigits(value: string): string {
    return value.replace(/\D/g, "");
}

export function formatPhoneNational(value: string, country: CountryCode): string {
    const digits = normalizePhoneDigits(value);

    return new AsYouType(country, metadata).input(digits);
}

export function toE164Phone(value: string, country: CountryCode): string | null {
    const digits = normalizePhoneDigits(value);

    if (digits.length === 0) {
        return null;
    }

    const parsed = parsePhoneNumberFromString(digits, country, metadata);
    return parsed && parsed.isValid() ? parsed.number : null;
}

export function isPhoneInputValid(value: string, country: CountryCode): boolean {
    return toE164Phone(value, country) !== null;
}
