import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "../src/index.css";

export const metadata: Metadata = {
  title: {
    default: "ResearchForge — Evidence, made clear",
    template: "%s | ResearchForge",
  },
  description:
    "Turn complex questions into structured, evidence-backed research with a transparent multi-agent workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
