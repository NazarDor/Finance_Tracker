import "./globals.css";
import Providers from "./components/Providers";
import MainLayout from "./components/MainLayout/MainLayout"
import 'flowbite';

export const metadata = {
  title: "ND-Studio",
  description: "my studio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
