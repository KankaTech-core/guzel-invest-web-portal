"use client";

import { SOCIAL_LINKS } from "@/lib/social-links";

const socialButtons = [
    {
        label: "Telegram",
        href: SOCIAL_LINKS.telegram,
        bgClass: "bg-[#229ED9]",
        hoverClass: "hover:bg-[#1B8CBF]",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M9.993 15.673 9.575 21.56c.602 0 .862-.259 1.174-.57l2.814-2.694 5.834 4.268c1.07.596 1.825.283 2.114-.986l3.83-17.946.001-.001c.34-1.586-.573-2.207-1.616-1.819L1.21 10.474c-1.535.596-1.512 1.452-.261 1.84l5.756 1.792L20.072 5.75c.63-.417 1.203-.186.732.231" />
            </svg>
        ),
    },
    {
        label: "WhatsApp",
        href: SOCIAL_LINKS.whatsapp,
        bgClass: "bg-[#25D366]",
        hoverClass: "hover:bg-[#1DA851]",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M20.52 3.48A11.83 11.83 0 0 0 12.08 0C5.57 0 .28 5.3.28 11.82c0 2.08.54 4.1 1.57 5.88L0 24l6.48-1.7a11.76 11.76 0 0 0 5.6 1.42h.01c6.51 0 11.8-5.3 11.8-11.82 0-3.16-1.23-6.13-3.47-8.42Zm-8.43 18.24h-.01a9.78 9.78 0 0 1-4.98-1.37l-.36-.22-3.84 1.01 1.03-3.74-.24-.38a9.77 9.77 0 0 1-1.5-5.2c0-5.42 4.42-9.84 9.86-9.84 2.63 0 5.1 1.02 6.96 2.88a9.77 9.77 0 0 1 2.88 6.96c0 5.42-4.42 9.84-9.86 9.84Zm5.4-7.35c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.11 3.22 5.11 4.52.71.31 1.27.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35Z" />
            </svg>
        ),
    },
] as const;

export function FloatingSocialButtons() {
    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden lg:flex">
            <div className="pointer-events-auto flex flex-col gap-3">
                {socialButtons.map((button) => (
                    <a
                        key={button.label}
                        href={button.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={button.label}
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 ${button.bgClass} ${button.hoverClass}`}
                    >
                        {button.icon}
                    </a>
                ))}
            </div>
        </div>
    );
}
