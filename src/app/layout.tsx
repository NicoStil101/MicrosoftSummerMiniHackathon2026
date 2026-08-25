import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Agent Bazaar — the bazaar for production agents",
    template: "%s · Agent Bazaar",
  },
  description:
    "Publish agents and their skills, search the catalogue, and let every upload land in the right category automatically.",
};

/**
 * Stamps the saved theme onto <html> before first paint, so a viewer who
 * pinned light doesn't get a flash of the OS's dark palette.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above sets data-theme before React
    // hydrates, and dark-mode browser extensions add their own attributes here.
    <html
      lang="en"
      className={`${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
