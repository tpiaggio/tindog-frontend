import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "@/components/providers";
import {Toaster} from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Tindog",
  description: "Connect with fellow dog lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </>
  );
}
