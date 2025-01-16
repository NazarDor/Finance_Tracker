import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
// import { getPrismaClientForUser } from "../../../../lib/prisma";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("У пользователя отсутствует доступ к сайту");
        }
        // getPrismaClientForUser(`user_${user.id}`);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          databaseName: `user_${user.id}`,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.status = token.status;
        session.user.databaseName = token.databaseName;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.status = user.status;
        token.databaseName = user.databaseName;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
