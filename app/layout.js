import "./globals.css";
import Providers from "./components/Providers";
import MainLayout from "./components/MainLayout/MainLayout"
import 'flowbite';

export const metadata = {
  title: "Spring Of Life",
  description: "Church",
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
