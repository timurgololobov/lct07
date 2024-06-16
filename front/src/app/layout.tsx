import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ListNavigate from "./_components/listnavigate/ListNabigate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Сервис для проектирования зданий",
  description: "Сервис для проектирования зданий на заданной территории",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ListNavigate />
        {children}
      </body>
    </html>
  );
}
