import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Header from "@/app/components/header";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./components/auth-provider";
import QcProvider from "./components/qc-provider";
import ThemeProvider from "./components/theme-provider";

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
        <QcProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </QcProvider>
        <Toaster richColors />
      </body>
    </html>
  );
};

export default Layout;
