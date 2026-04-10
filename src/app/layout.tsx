import type { Metadata } from "next";
import { CopilotKit } from "@copilotkit/react-core";
import "./globals.css";
import "./copilot-theme.css";

export const metadata: Metadata = {
  title: "CryptoDesk — Personal Crypto Intelligence Agent",
  description: "Your personal AI crypto agent. Powered by Nosana decentralized compute.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}