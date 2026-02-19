import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Agentation } from "agentation";
import "@/app/globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Güzel Invest",
    description: "Real Estate Portfolio",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={`${outfit.variable} font-sans antialiased bg-white`}>
                {children}
                {process.env.NODE_ENV === "development" && <Agentation />}
            </body>
        </html>
    );
}
