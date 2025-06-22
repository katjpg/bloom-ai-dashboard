import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";

const clashGrotesk = localFont({
  src: "../../public/fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash-grotesk",
  display: "swap",
});

const uncutSans = localFont({
  src: [
    {
      path: "../../public/fonts/uncut/woff2/UncutSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/uncut/woff2/UncutSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/uncut/woff2/UncutSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/uncut/woff2/UncutSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-uncut-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom AI",
  description: "AI-powered moderation and sentiment analysis for gaming communities. Detect toxicity, protect player data, and reward positive behavior—all in real-time.",
  icons: {
    icon: "/icons/bloom-logo.svg",
    shortcut: "/icons/bloom-logo.svg",
    apple: "/icons/bloom-logo.svg",
  },
  openGraph: {
    title: "Bloom AI",
    description: "AI-powered moderation and sentiment analysis for gaming communities. Detect toxicity, protect player data, and reward positive behavior—all in real-time.",
    url: "https://bloom-ai.com",
    siteName: "Bloom AI",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Bloom AI - Keep Your Gaming Community Safe & Positive",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloom AI",
    description: "AI-powered moderation and sentiment analysis for gaming communities. Detect toxicity, protect player data, and reward positive behavior—all in real-time.",
    images: ["/thumbnail.png"],
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
        className={`${clashGrotesk.variable} ${uncutSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
