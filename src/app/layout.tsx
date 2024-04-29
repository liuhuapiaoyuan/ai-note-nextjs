import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextUIProvider } from "./NextUIProvider";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowBrain",
  description: "The intelligent note-taking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <NextUIProvider>
            <ThemeProvider attribute="class">
              {children}
            </ThemeProvider>
          </NextUIProvider>
        </body>
      </html>
    </>
  );
}
