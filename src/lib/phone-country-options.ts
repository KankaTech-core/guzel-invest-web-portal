import {
    getCountries,
    getCountryCallingCode,
    type CountryCode,
} from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";

export interface PhoneCountryOption {
    value: CountryCode;
    name: string;
    flag: string;
    callingCode: string;
    searchableText: string;
}

function countryCodeToFlag(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .split("")
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join("");
}

function getCountryDisplayName(countryCode: CountryCode): string {
    const preferredLocales = ["tr", "en"];
    const supportedLocale = Intl.DisplayNames.supportedLocalesOf(preferredLocales)[0] ?? "en";
    const displayNames = new Intl.DisplayNames([supportedLocale], { type: "region" });
    return displayNames.of(countryCode) ?? countryCode;
}

export const phoneCountryOptions: PhoneCountryOption[] = getCountries(metadata)
    .map((countryCode) => {
        const callingCode = `+${getCountryCallingCode(countryCode, metadata)}`;
        const flag = countryCodeToFlag(countryCode);
        const name = getCountryDisplayName(countryCode);

        return {
            value: countryCode,
            name,
            flag,
            callingCode,
            searchableText: `${name} ${countryCode} ${callingCode}`.toLocaleLowerCase("tr-TR"),
        };
    })
    .sort((a, b) => {
        if (a.value === "TR") return -1;
        if (b.value === "TR") return 1;
        return a.name.localeCompare(b.name, "tr");
    });
