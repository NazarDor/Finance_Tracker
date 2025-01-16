import { PrismaClient } from "@prisma/client";

let prisma;

// if (process.env.NODE_ENV === "production") {
//   function getPrismaClientForUser(userId) {
//     const databaseName = `user_${userId}`;
//     const databaseUrl = `mysql://root:${process.env.MYSQL_PASSWORD}@localhost:3306/${databaseName}`;
//     const prisma = new PrismaClient({
//       datasources: { db: { url: databaseUrl } },
//     });

//     return prisma;
//   }
// } else {
  
// }

if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

export default prisma;
