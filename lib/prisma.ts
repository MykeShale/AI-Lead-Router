const globalForPrisma = global as unknown as { prisma: any };

const { PrismaClient } = require("@prisma/client");

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
