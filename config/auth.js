import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth";

export const authConfig = {
  providers: [
    GoogleProvider({
        clientId: '',
        clientSecret: '',
    })
  ],
};
