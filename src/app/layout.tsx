import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QcProvider from "./components/qc-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moviereserv",
  description: "Frontend for the movie reservation system",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <QcProvider>{children}</QcProvider>
        <Toaster richColors />
      </body>
    </html>
  );
};

export default Layout;
