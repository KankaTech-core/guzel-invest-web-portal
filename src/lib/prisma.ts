import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const hasFeedbackDelegates = (client: PrismaClient | undefined): boolean => {
  if (!client) {
    return false;
  }

  const rawClient = client as unknown as Record<string, unknown>;
  return Boolean(rawClient.siteFeedbackThread) && Boolean(rawClient.siteFeedbackMessage);
};

const shouldRecreateClient =
  globalForPrisma.prisma && !hasFeedbackDelegates(globalForPrisma.prisma);

if (shouldRecreateClient) {
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
