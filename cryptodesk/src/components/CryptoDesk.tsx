"use client";

import { useState, useEffect } from "react";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import WatchlistPanel from "./panels/WatchlistPanel";
import ActivityPanel from "./panels/ActivityPanel";
import Header from "./Header";

export default function CryptoDesk() {
  const [time, setTime] = useState("");
  const [nosanaStatus] = useState<"online" | "connecting" | "offline">("online");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-10 flex flex-col h-screen overflow-hidden">
      <Header time={time} nosanaStatus={nosanaStatus} />

      {/* Three-panel layout */}
      <div className="flex flex-1 gap-2 p-2 overflow-hidden">

        {/* LEFT: Watchlist + Reminders */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-hidden">
          <WatchlistPanel />
        </div>

        {/* CENTER: Chat Interface */}
        <div className="flex-1 flex flex-col panel overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="pulse-dot bg-[var(--accent-green)]" />
              <span className="mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                Agent Terminal
              </span>
            </div>
            <div className="flex gap-1">
              {["brief me", "research DeFi", "check watchlist", "draft thread"].map((cmd) => (
                <QuickAction key={cmd} label={cmd} />
              ))}
            </div>
          </div>

          {/* CopilotKit Chat */}
          <div className="flex-1 overflow-hidden cryptodesk-chat">
            <CopilotChat
              className="h-full"
              instructions="You are CryptoDesk. Be concise, crypto-native, and always end with a 💡 Action."
              labels={{
                title: "",
                initial: `**GM. CryptoDesk is live on Nosana.**\n\nI'm your personal crypto intelligence agent. Here's what I can do:\n\n• \`brief me\` — Morning briefing: narratives + watchlist + reminders\n• \`research [topic]\` — Deep dive any crypto narrative\n• \`check watchlist\` — What's moving in your bags\n• \`draft thread about [topic]\` — Twitter thread in your voice\n• \`add [token] to watchlist\` — Track something new\n• \`remind me to [task] on [date]\` — Save important dates\n\nWhat do you need?`,
                placeholder: "research solana narrative / brief me / add ETH to watchlist ...",
              }}
            />
          </div>
        </div>

        {/* RIGHT: Activity + Stats */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-hidden">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  const { appendMessage } = useCopilotChat();

  const handleClick = () => {
    appendMessage({ id: Date.now().toString(), role: "user", content: label, createdAt: new Date() });
  };

  return (
    <button className="quick-btn" onClick={handleClick}>
      {label}
    </button>
  );
}
