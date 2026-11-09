import type { Metadata, Viewport } from "next";
import { Playfair_Display, Roboto, Roboto_Condensed } from "next/font/google";
import { site } from "@/data/site";
import Footer from "@/components/layout/Footer";
import FloatingSocials from "@/components/layout/FloatingSocials";
import MotionProvider from "@/components/layout/MotionProvider";
import Navbar from "@/components/layout/Navbar";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const display = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Letra elegante para frases y subtitulos
const serif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.claim}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.claim}`,
    description: site.description,
    locale: "es_BO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
    >
      <body className="bg-night-900 font-body text-white antialiased">
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingSocials />
        </MotionProvider>
        <RegisterSW />
      </body>
    </html>
  );
}