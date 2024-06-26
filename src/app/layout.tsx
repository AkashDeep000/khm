import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { validateRequest } from "@/lib/auth";
import {  Toaster} from "sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Trigger Offer Manager - KHM",
  icons: '/favicon.ico'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await validateRequest();
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-accent dark:bg-accent/50 font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider authData={authData}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors/>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
