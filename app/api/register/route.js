import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { exec } from "child_process";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword, status: "User" },
    });
    // const databaseName = `user_${user.id}`;
    // await createDatabase(databaseName);

    return NextResponse.json(
      { message: "User registered and database created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// export async function createDatabase(databaseName) {
//   const connection = await mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: process.env.MYSQL_PASSWORD,
//   });

//   try {
//     await connection.query(`CREATE DATABASE \`${databaseName}\``);
//     console.log(`Database ${databaseName} created successfully.`);
//   } catch (error) {
//     console.error("Error creating database:", error);
//     throw error;
//   } finally {
//     await connection.end();
//   }
// }

// async function runMigrations(databaseName) {
//   return new Promise((resolve, reject) => {
//     // const migrateCommand = `npx prisma migrate deploy --schema=./prisma/user.prisma`;
//     const databaseName = `user_${userId}`;
//     const migrateCommand = `DATABASE_URL="mysql://root:${process.env.MYSQL_PASSWORD}@localhost:3306/${databaseName}" npx prisma migrate deploy --schema=./prisma/user.prisma`;
//     exec(migrateCommand, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Error running migrations:", stderr);
//         return reject(err);
//       }
//       console.log(`Migrations applied to database ${databaseName}.`);
//       resolve();
//     });
//   });
// }
