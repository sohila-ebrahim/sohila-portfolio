import type { Metadata } from "next";
import { Alexandria, Bricolage_Grotesque, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import FloatingButtons from "@/components/FloatingButtons";
import { profile } from "@/data/portfolio";

const sans = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const sign = Mrs_Saint_Delafield({ variable: "--font-sign", weight: "400", subsets: ["latin"] });
const arabic = Alexandria({ variable: "--font-alexandria", subsets: ["arabic", "latin"], weight: ["500", "700", "800", "900"] });

export const metadata: Metadata = {
  title: `${profile.firstName[0]}${profile.firstName.slice(1).toLowerCase()} ${profile.lastName[0]}${profile.lastName.slice(1).toLowerCase()} — ${profile.role}`,
  description: profile.intro,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${sign.variable} ${arabic.variable} antialiased`}>
      <body>
        <SmoothScroll>
          <Cursor />
          <Navbar />
          {children}
          <FloatingButtons />
        </SmoothScroll>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
