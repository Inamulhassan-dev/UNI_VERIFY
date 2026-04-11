import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UNI-VERIFY | Project Originality Validation Portal",
  description: "AI-powered project originality validation system for St. Philomena's College, Mysore. Upload your synopsis and verify project uniqueness.",
  keywords: ["project validation", "originality check", "plagiarism detection", "student projects", "St Philomena's College"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
