"use client";

import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

function Providers({ children }) {
  return (
    <>
      <Toaster />
      <NextTopLoader showSpinner={false} />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}

export default appWithTranslation(Providers);