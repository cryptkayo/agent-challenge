"use client";

import { useState, useEffect } from "react";
import { useCopilotChat } from "@copilotkit/react-core";

interface WatchlistItem {
  symbol: string;
  sentiment?: "bullish" | "bearish" | "neutral";
}

interface Reminder {
  text: string;
  dueDate: string;
}

export default function WatchlistPanel() {
  const [watchlist] = useState<WatchlistItem[]>([
    { symbol: "ETH", sentiment: "bullish" },
    { symbol: "SOL", sentiment: "neutral" },
    { symbol: "ARB", sentiment: "bearish" },
    { symbol: "EIGEN", sentiment: "neutral" },
  ]);
  const [reminders] = useState<Reminder[]>([
    { text: "Check Arbitrum governance vote", dueDate: "Tomorrow" },
    { text: "ARB token unlock", dueDate: "Apr 15" },
  ]);
  const [newItem, setNewItem] = useState("");
  const { appendMessage } = useCopilotChat();

  const handleAdd = () => {
    if (!newItem.trim()) return;
    appendMessage({ role: "user", content: `add ${newItem} to my watchlist` });
    setNewItem("");
  };

  const sentimentIcon = {
    bullish: "↑",
    bearish: "↓",
    neutral: "—",
  };

  const sentimentColor = {
    bullish: "var(--accent-green)",
    bearish: "var(--accent-red)",
    neutral: "var(--text-dim)",
  };

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      {/* Watchlist */}
      <div className="panel flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="pulse-dot bg-[var(--accent-blue)]" />
            <span className="mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
              Watchlist
            </span>
          </div>
          <span className="mono text-xs text-[var(--text-dim)]">{watchlist.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between px-2 py-2 rounded-sm hover:bg-[var(--bg-card)] transition-colors cursor-pointer group"
              onClick={() => appendMessage({ role: "user", content: `check ${item.symbol} news` })}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{
                    background: item.sentiment ? sentimentColor[item.sentiment] : "var(--text-dim)",
                  }}
                />
                <span className="mono text-sm font-bold text-[var(--text-primary)]">
                  {item.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="mono text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-dim)]"
                  style={{ fontSize: "10px" }}
                >
                  check →
                </span>
                <span
                  className="mono text-sm font-bold"
                  style={{
                    color: item.sentiment ? sentimentColor[item.sentiment] : "var(--text-dim)",
                  }}
                >
                  {item.sentiment ? sentimentIcon[item.sentiment] : "—"}
                </span>
              </div>
            </div>
          ))}

          {watchlist.length === 0 && (
            <div className="flex items-center justify-center h-16">
              <span className="mono text-xs text-[var(--text-dim)]">empty — add assets below</span>
            </div>
          )}
        </div>

        {/* Add to watchlist */}
        <div className="flex border-t border-[var(--border)] p-2 gap-1">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="add asset..."
            className="flex-1 bg-transparent mono text-xs text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none px-2 py-1 border border-[var(--border)] rounded-sm focus:border-[var(--accent-green)] transition-colors"
          />
          <button
            onClick={handleAdd}
            className="mono text-xs px-2 py-1 border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-colors rounded-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="panel flex flex-col overflow-hidden" style={{ maxHeight: "200px" }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="pulse-dot bg-[var(--accent-orange)]" />
            <span className="mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
              Reminders
            </span>
          </div>
          <span className="mono text-xs text-[var(--text-dim)]">{reminders.length}</span>
        </div>

        <div className="overflow-y-auto p-2 space-y-1">
          {reminders.map((r, i) => (
            <div key={i} className="px-2 py-2 rounded-sm hover:bg-[var(--bg-card)] transition-colors">
              <div className="mono text-xs text-[var(--text-primary)] leading-relaxed">{r.text}</div>
              <div
                className="mono text-xs mt-1"
                style={{ color: "var(--accent-orange)", fontSize: "10px" }}
              >
                ⏰ {r.dueDate}
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="flex items-center justify-center h-10">
              <span className="mono text-xs text-[var(--text-dim)]">no reminders</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
