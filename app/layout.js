import "./globals.css";
import Providers from "./components/Providers";
import MainLayout from "./components/MainLayout/MainLayout";

export const metadata = {
  title: "ND-Studio",
  description: "my studio",
};

export default function RootLayout({ children, params }) {
  return (
    <html lang={params?.locale || "en"}>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
