"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
    Mail,
    MessageCircleMore,
    PhoneCall,
    Send,
    User,
    X,
} from "lucide-react";

interface ListingContactPanelProps {
    title: string;
    phoneNumber: string;
    phoneLabel: string;
}

const subscribeNoop = () => () => { };

function ContactFormFields({ title }: { title: string }) {
    return (
        <form className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <User className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız *"
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    type="email"
                    required
                    placeholder="E-posta Adresiniz *"
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <PhoneCall className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    type="tel"
                    required
                    placeholder="Telefon Numaranız *"
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none"
                />
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <MessageCircleMore className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                <textarea
                    rows={5}
                    placeholder="Mesajınız"
                    className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed text-[#111828] placeholder:text-gray-400 focus:outline-none"
                    defaultValue={`Merhaba, ${title} ilanı hakkında bilgi almak istiyorum.`}
                />
            </div>
            <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5099ff] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3f86e4]"
            >
                <Send className="h-4 w-4" />
                Gönder
            </button>
        </form>
    );
}

export function ListingContactPanel({
    title,
    phoneNumber,
    phoneLabel,
}: ListingContactPanelProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isHydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("keydown", onEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onEscape);
        };
    }, [isMobileOpen]);

    return (
        <>
            <aside className="sticky top-28 hidden self-start xl:block">
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[2rem] border border-gray-200 bg-white p-6">
                    <h2 className="text-2xl font-semibold text-[#111828]">İletişime Geçin</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Uzman danışmanlarımız bu ilan için aynı gün içinde geri dönüş
                        sağlar.
                    </p>
                    <div className="mt-5">
                        <ContactFormFields title={title} />
                    </div>
                    <a
                        href={`tel:+${phoneNumber}`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#ff6900] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                    >
                        <PhoneCall className="h-4 w-4" />
                        {phoneLabel}
                    </a>
                </div>
            </aside>

            {isHydrated
                ? createPortal(
                    <>
                        <div
                            className={`fixed inset-x-4 z-[10020] transition-opacity xl:hidden ${isMobileOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                            style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
                        >
                            <button
                                type="button"
                                onClick={() => setIsMobileOpen(true)}
                                className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[#111828] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(17,24,40,0.36)] transition hover:bg-[#1d2740]"
                            >
                                <Send className="h-4 w-4" />
                                Bilgi Talep Formu
                            </button>
                        </div>

                        {isMobileOpen ? (
                            <div
                                className="fixed inset-0 z-[10030] bg-black/55 backdrop-blur-[1px]"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="sr-only"
                                    aria-label="Formu kapat"
                                >
                                    Kapat
                                </button>

                                <div
                                    className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[2rem] border-t border-gray-200 bg-white shadow-2xl"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#111828]">İletişime Geçin</h3>
                                            <p className="text-sm text-gray-500">
                                                Formu doldurun, sizi aynı gün arayalım.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                                            aria-label="Formu kapat"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.1rem)] pt-4">
                                        <ContactFormFields title={title} />
                                        <a
                                            href={`tel:+${phoneNumber}`}
                                            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#ff6900] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                                        >
                                            <PhoneCall className="h-4 w-4" />
                                            {phoneLabel}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </>,
                    document.body
                )
                : null}
        </>
    );
}
