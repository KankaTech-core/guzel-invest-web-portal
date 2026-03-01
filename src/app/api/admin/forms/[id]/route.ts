import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const { status, notes, tags } = body;

        await prisma.$transaction(async (tx) => {
            if (tags && Array.isArray(tags)) {
                await tx.contactSubmissionTag.deleteMany({
                    where: { contactSubmissionId: id },
                });

                for (const tagName of tags) {
                    const tag = await tx.tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: { name: tagName, color: "#6B7280" },
                    });

                    await tx.contactSubmissionTag.create({
                        data: {
                            contactSubmissionId: id,
                            tagId: tag.id,
                        },
                    });
                }
            }

            const dataToUpdate: any = {};
            if (status !== undefined) dataToUpdate.status = status;
            if (notes !== undefined) dataToUpdate.notes = notes;

            if (Object.keys(dataToUpdate).length > 0) {
                await tx.contactSubmission.update({
                    where: { id },
                    data: dataToUpdate,
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating form:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
