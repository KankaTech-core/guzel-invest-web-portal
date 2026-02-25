import assert from "node:assert/strict";
import test from "node:test";
import { Prisma } from "@/generated/prisma";
import { replaceProjectMediaAssignments } from "./project-media-assignments";

type UpdateManyArgs = {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
};

function createTransactionMock(calls: UpdateManyArgs[]) {
    return {
        media: {
            updateMany: async (args: UpdateManyArgs) => {
                calls.push(args);
                return { count: 1 };
            },
        },
    } as unknown as Prisma.TransactionClient;
}

test("replaceProjectMediaAssignments exits early when no categories are provided", async () => {
    const calls: UpdateManyArgs[] = [];
    const tx = createTransactionMock(calls);

    await replaceProjectMediaAssignments(tx, "listing-1", {});

    assert.equal(calls.length, 0);
});

test("replaceProjectMediaAssignments uses first normalized exterior media id as cover", async () => {
    const calls: UpdateManyArgs[] = [];
    const tx = createTransactionMock(calls);

    await replaceProjectMediaAssignments(tx, "listing-1", {
        exteriorMediaIds: [" ext-2 ", "ext-2", "ext-1"],
    });

    assert.equal(calls.length, 4);

    const clearCoverCall = calls[calls.length - 2];
    const setCoverCall = calls[calls.length - 1];

    assert.deepEqual(clearCoverCall.where, {
        listingId: "listing-1",
        type: "IMAGE",
        isCover: true,
    });
    assert.deepEqual(clearCoverCall.data, { isCover: false });

    assert.deepEqual(setCoverCall.where, {
        listingId: "listing-1",
        id: "ext-2",
        type: "IMAGE",
    });
    assert.deepEqual(setCoverCall.data, { isCover: true });
});
