import type { Metadata } from "next";
import { CopilotKit } from "@copilotkit/react-core";
import CryptoDesk from "@/components/CryptoDesk";
import "./globals.css";
import "./copilot-theme.css";

export const metadata: Metadata = {
  title: "CryptoDesk â€” Personal Crypto Intelligence Agent",
  description: "Your personal AI crypto agent. Research narratives, track your watchlist, draft threads, and get daily briefings. Powered by Nosana decentralized compute.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="cryptoDeskAgent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}

