import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { PostHogProvider } from "../providers/PH";

const manrope = Poppins({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "ICallOn",
  description: "Animal, Place or Things Game",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <PostHogProvider>
          <Toaster position="top-right" />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
