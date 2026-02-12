"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Version = "v1" | "v2";

type VersionContextType = {
    version: Version;
    toggleVersion: () => void;
    setVersion: (v: Version) => void;
};

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState<Version>("v1");

    const toggleVersion = () => {
        setVersion((prev) => (prev === "v1" ? "v2" : "v1"));
    };

    return (
        <VersionContext.Provider value={{ version, toggleVersion, setVersion }}>
            {children}
        </VersionContext.Provider>
    );
}

export function useVersion() {
    const context = useContext(VersionContext);
    if (context === undefined) {
        throw new Error("useVersion must be used within a VersionProvider");
    }
    return context;
}
