"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <>
      <Toaster />
      <NextTopLoader showSpinner={false}/>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
