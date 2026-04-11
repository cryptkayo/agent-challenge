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
              instructions="You are CryptoDesk. Be concise, crypto-native, and always end with a ðŸ’¡ Action."
              labels={{
                title: "",
                initial: `**GM. CryptoDesk is live on Nosana.**\n\nI'm your personal crypto intelligence agent. Here's what I can do:\n\nâ€¢ \`brief me\` â€” Morning briefing: narratives + watchlist + reminders\nâ€¢ \`research [topic]\` â€” Deep dive any crypto narrative\nâ€¢ \`check watchlist\` â€” What's moving in your bags\nâ€¢ \`draft thread about [topic]\` â€” Twitter thread in your voice\nâ€¢ \`add [token] to watchlist\` â€” Track something new\nâ€¢ \`remind me to [task] on [date]\` â€” Save important dates\n\nWhat do you need?`,
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
    appendMessage(label as any);
  };

  return (
    <button className="quick-btn" onClick={handleClick}>
      {label}
    </button>
  );
}
