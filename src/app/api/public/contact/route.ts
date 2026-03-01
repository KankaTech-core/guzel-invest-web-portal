import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, surname, email, phone, subject, message, locale } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        const submissionMessage = subject ? `Konu: ${subject}\n\n${message}` : message;

        const submission = await prisma.contactSubmission.create({
            data: {
                name,
                surname,
                email,
                phone,
                message: submissionMessage,
                source: "website",
                locale: locale || "tr",
            },
        });

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
