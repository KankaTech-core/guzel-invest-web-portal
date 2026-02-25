"use client";

import { useSyncExternalStore } from "react";
import { Navbar } from "@/components/public/navbar";

const subscribeNoop = () => () => { };

export function NavbarHydrated({ locale }: { locale: string }) {
    const mounted = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    if (!mounted) {
        return null;
    }

    return <Navbar locale={locale} />;
}
