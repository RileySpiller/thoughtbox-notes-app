import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ThoughtBox - Your Personal Note Taking App",
  description:
    "A clean, beautiful app for capturing and organizing your thoughts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="mytheme" className="overflow-x-hidden">
      <body className={`${inter.variable} font-sans min-h-screen bg-white`}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
