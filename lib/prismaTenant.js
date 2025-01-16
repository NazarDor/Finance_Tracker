import { PrismaClient } from "@prisma/client";

let prismaInstances = {};

export function getPrismaClientForUser(databaseName) {
  if (!databaseName) {
    throw new Error("Database name must be provided");
  }

  if (!prismaInstances[databaseName]) {
    prismaInstances[databaseName] = new PrismaClient({
      datasources: {
        db: {
          url: `mysql://root:${process.env.MYSQL_PASSWORD}@localhost:3306/${databaseName}`,
        },
      },
    });
  }

  return prismaInstances[databaseName];
}
