'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import type { CountryCode } from 'libphonenumber-js';
import en from 'react-phone-number-input/locale/en';

type LocaleLabels = { [key: string]: string };
const labels: LocaleLabels = en as LocaleLabels;

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultCountry?: CountryCode;
}

interface PhoneInputInitialState {
  selectedCountry: CountryCode;
  phoneNumber: string;
  formattedPhone: string;
}

function getFlagEmoji(countryCode: CountryCode): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return '';
  const parts: string[] = [];
  let remaining = digits;

  if (remaining.length > 0) { parts.push(remaining.slice(0, 3)); remaining = remaining.slice(3); }
  if (remaining.length > 0) { parts.push(remaining.slice(0, 3)); remaining = remaining.slice(3); }
  if (remaining.length > 0) { parts.push(remaining.slice(0, 2)); remaining = remaining.slice(2); }
  if (remaining.length > 0) { parts.push(remaining.slice(0, 2)); remaining = remaining.slice(2); }
  if (remaining.length > 0) { parts.push(remaining); }

  return parts.join(' ');
}

function extractDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function getInitialPhoneState(
  value: string,
  defaultCountry: CountryCode,
  countries: CountryCode[]
): PhoneInputInitialState {
  if (value && value.startsWith('+')) {
    const sortedCountries = [...countries].sort((a, b) => {
      const codeA = getCountryCallingCode(a);
      const codeB = getCountryCallingCode(b);
      return codeB.length - codeA.length;
    });

    for (const country of sortedCountries) {
      const code = getCountryCallingCode(country);
      if (value.startsWith(`+${code}`)) {
        const localNumber = value.slice(code.length + 1).replace(/\s/g, '').trim();
        return {
          selectedCountry: country,
          phoneNumber: localNumber,
          formattedPhone: formatPhoneNumber(localNumber),
        };
      }
    }
  }

  if (value && !value.startsWith('+')) {
    const digits = extractDigits(value);
    return {
      selectedCountry: defaultCountry,
      phoneNumber: digits,
      formattedPhone: formatPhoneNumber(digits),
    };
  }

  return {
    selectedCountry: defaultCountry,
    phoneNumber: '',
    formattedPhone: '',
  };
}

export function PhoneInput({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className = '',
  defaultCountry = 'AE',
}: PhoneInputProps) {
  const countries = useMemo(() => getCountries(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    () => getInitialPhoneState(value, defaultCountry, countries).selectedCountry
  );
  const [phoneNumber, setPhoneNumber] = useState(
    () => getInitialPhoneState(value, defaultCountry, countries).phoneNumber
  );
  const [formattedPhone, setFormattedPhone] = useState(
    () => getInitialPhoneState(value, defaultCountry, countries).formattedPhone
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const updateValue = useCallback((country: CountryCode, phone: string) => {
    const code = getCountryCallingCode(country);
    const digits = extractDigits(phone);
    const fullNumber = digits ? `+${code}${digits}` : '';
    onChange(fullNumber);
  }, [onChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = countries.filter((country) => {
    const countryName = labels[country] || country;
    const countryCode = `+${getCountryCallingCode(country)}`;
    const query = searchQuery.toLowerCase();
    return (
      countryName.toLowerCase().includes(query) ||
      countryCode.includes(query) ||
      country.toLowerCase().includes(query)
    );
  });

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    updateValue(country, phoneNumber);
    setTimeout(() => phoneInputRef.current?.focus(), 100);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = extractDigits(inputValue);
    const limitedDigits = digits.slice(0, 15);

    setPhoneNumber(limitedDigits);
    setFormattedPhone(formatPhoneNumber(limitedDigits));
    updateValue(selectedCountry, limitedDigits);
  };

  const countryCallingCode = getCountryCallingCode(selectedCountry);
  const countryName = labels[selectedCountry] || selectedCountry;

  return (
    <div className={`phone-input-container ${className}`} ref={dropdownRef}>
      <div className="phone-input-wrapper">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="phone-input-country-btn"
          aria-label={`Select country, current: ${countryName}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="phone-input-flag">{getFlagEmoji(selectedCountry)}</span>
          <svg
            className={`phone-input-chevron ${isOpen ? 'is-open' : ''}`}
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div className="phone-input-divider"></div>
        <span className="phone-input-code">+{countryCallingCode}</span>

        <input
          ref={phoneInputRef}
          type="tel"
          value={formattedPhone}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="phone-input-field"
          aria-label="Phone number"
        />
      </div>

      {isOpen && (
        <div className="phone-input-dropdown" role="listbox">
          <div className="phone-input-search-wrapper">
            <svg
              className="phone-input-search-icon" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country by name..."
              className="phone-input-search"
              aria-label="Search countries"
            />
          </div>

          <div className="phone-input-list">
            {filteredCountries.length === 0 ? (
              <div className="phone-input-no-results">No countries found</div>
            ) : (
              filteredCountries.map((country) => {
                const name = labels[country] || country;
                const code = getCountryCallingCode(country);
                const isSelected = country === selectedCountry;

                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`phone-input-option ${isSelected ? 'is-selected' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="phone-input-option-flag">{getFlagEmoji(country)}</span>
                    <span className="phone-input-option-name">{name}</span>
                    <span className="phone-input-option-code">+{code}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .phone-input-container { position: relative; width: 100%; }
        .phone-input-wrapper { display: flex; align-items: center; width: 100%; border: 1px solid var(--color-accent, #e0cdbf); border-radius: 0.75rem; background: white; padding: 0 1rem; transition: all 0.2s ease; }
        .phone-input-wrapper:focus-within { outline: none; ring: 2px; ring-color: rgba(166, 95, 70, 0.2); border-color: var(--color-warm, #a65f46); box-shadow: 0 0 0 2px rgba(166, 95, 70, 0.2); }
        .phone-input-country-btn { display: flex; align-items: center; gap: 0.25rem; padding: 0.75rem 0; background: transparent; border: none; cursor: pointer; color: var(--color-primary, #1a1a1a); }
        .phone-input-country-btn:hover { opacity: 0.8; }
        .phone-input-flag { font-size: 1.25rem; line-height: 1; }
        .phone-input-chevron { color: var(--color-primary, #1a1a1a); transition: transform 0.2s ease; }
        .phone-input-chevron.is-open { transform: rotate(180deg); }
        .phone-input-divider { width: 1px; height: 24px; background: var(--color-accent, #e0cdbf); margin: 0 0.75rem; }
        .phone-input-code { color: var(--color-primary, #1a1a1a); font-size: 1rem; font-weight: 500; white-space: nowrap; margin-right: 0.5rem; user-select: none; }
        .phone-input-field { flex: 1; border: none; background: transparent; padding: 0.75rem 0; font-size: 1rem; color: var(--color-primary, #1a1a1a); outline: none; min-width: 0; }
        .phone-input-field::placeholder { color: #888; opacity: 0.7; }
        .phone-input-dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid var(--color-accent, #e0cdbf); border-radius: 0.75rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); z-index: 100; overflow: hidden; animation: dropdownFadeIn 0.2s ease; }
        @keyframes dropdownFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .phone-input-search-wrapper { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1rem; border-bottom: 1px solid var(--color-accent, #e0cdbf); }
        .phone-input-search-icon { color: #555; flex-shrink: 0; }
        .phone-input-search { flex: 1; border: none; background: transparent; font-size: 0.95rem; color: var(--color-primary, #1a1a1a); outline: none; }
        .phone-input-search::placeholder { color: #666; opacity: 0.8; }
        .phone-input-list { max-height: 280px; overflow-y: auto; }
        .phone-input-list::-webkit-scrollbar { width: 8px; }
        .phone-input-list::-webkit-scrollbar-track { background: transparent; }
        .phone-input-list::-webkit-scrollbar-thumb { background: var(--color-accent, #d0bfb0); border-radius: 4px; }
        .phone-input-option { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; background: transparent; border: none; cursor: pointer; text-align: left; transition: background 0.15s ease; }
        .phone-input-option:hover, .phone-input-option.is-selected { background: var(--color-accent-light, #f7eee6); }
        .phone-input-option-flag { font-size: 1.25rem; line-height: 1; }
        .phone-input-option-name { flex: 1; color: var(--color-primary, #1a1a1a); font-size: 0.95rem; }
        .phone-input-option-code { color: #555; font-size: 0.9rem; font-weight: 500; }
        .phone-input-no-results { padding: 1rem; text-align: center; color: var(--color-secondary, #666); font-size: 0.95rem; }
      `}</style>
    </div>
  );
}

export default PhoneInput;
