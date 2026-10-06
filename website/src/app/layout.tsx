import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "@/styles/globals.css";
import "@/styles/experience.css";
import "@/styles/buttons.css";
import "@/styles/house.css";
import "@/styles/cursors.css";
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Domiorum Architects — Architecture & Interiors in Dhaka",
    template: "%s | Domiorum Architects",
  },
  description:
    "Domiorum Architects is an architecture and interiors studio founded by Zarin Nawar in Dhaka. Imagined with you. Built for you.",
  robots: { index: false, follow: false },
  icons: { apple: "/brand/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={jost.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
