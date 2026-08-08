import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matchtaym.sardorkhon.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MatchTaym — Futbol yangiliklari va tahlillar",
    template: "%s | MatchTaym",
  },
  description:
    "MatchTaym — futbol bo'yicha so'nggi yangiliklar, transferlar, o'yin natijalari va tahliliy maqolalar.",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "MatchTaym",
    title: "MatchTaym — Futbol yangiliklari va tahlillar",
    description:
      "Futbol bo'yicha so'nggi yangiliklar, transferlar va tahliliy maqolalar bir joyda.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${fredoka.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
