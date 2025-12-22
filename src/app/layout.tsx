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
  openGraph: {
    title: "ICallOn — Race Against Time, Beat Your Friends",
    description:
      "Your popular Animal, Place or Things Word Game",
    url: "https://i-call-on.vercel.app",
    siteName: "ICallOn",
    images: [
      {
        url: "https://i-call-on.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ICallOn — Race Against Time, Beat Your Friends",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ICallOn — Race Against Time, Beat Your Friends",
    description:
      "Your popular Animal, Place or Things Word Game",
    images: ["https://i-call-on.vercel.app/og-image.png"],
    creator: "@devadedeji",
  },
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
