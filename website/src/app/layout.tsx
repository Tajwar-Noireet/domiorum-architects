import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InteractionMotion } from "@/components/ui/InteractionMotion";
import "@/styles/globals.css";
import "@/styles/experience.css";
import "@/styles/buttons.css";
import "@/styles/house.css";
import "@/styles/cursors.css";
import "@/styles/refinements.css";
import "@/styles/portfolio.css";
import "@/styles/project-gallery-motion.css";
import "@/styles/project-hero-motion.css";
import "@/styles/editorial-motion.css";
import "@/styles/discover-interactions.css";
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
        <InteractionMotion />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
