import type { Metadata } from "next";
import { NextUIProvider } from "./NextUIProvider";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";


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
        <body  >
          <NextUIProvider>
            <ThemeProvider attribute="class">
              <div className="flex flex-col h-screen">
                {children}
              </div>
            </ThemeProvider>
          </NextUIProvider>
        </body>
      </html>
    </>
  );
}
