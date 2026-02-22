import { Prisma } from "@/generated/prisma";

interface BuildRoomScopeInput {
    canUseRoomFilters: boolean;
    rooms: string[];
}

export function buildListingsRoomScope({
    canUseRoomFilters,
    rooms,
}: BuildRoomScopeInput): Prisma.ListingWhereInput | null {
    if (!canUseRoomFilters || rooms.length === 0) {
        return null;
    }

    if (rooms.length === 1) {
        const room = rooms[0];
        return {
            OR: [
                {
                    isProject: false,
                    rooms: room,
                },
                {
                    isProject: true,
                    projectUnits: {
                        some: {
                            rooms: room,
                        },
                    },
                },
            ],
        };
    }

    return {
        OR: [
            {
                isProject: false,
                rooms: {
                    in: rooms,
                },
            },
            {
                isProject: true,
                projectUnits: {
                    some: {
                        rooms: {
                            in: rooms,
                        },
                    },
                },
            },
        ],
    };
}
