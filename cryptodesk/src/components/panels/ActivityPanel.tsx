"use client";

import { useState, useEffect } from "react";

interface ActivityItem {
  id: number;
  type: "research" | "watchlist" | "thread" | "brief" | "reminder";
  text: string;
  time: string;
}

const typeColor = {
  research: "var(--accent-blue)",
  watchlist: "var(--accent-green)",
  thread: "var(--accent-orange)",
  brief: "var(--accent-green)",
  reminder: "var(--accent-orange)",
};

const typeIcon = {
  research: "◈",
  watchlist: "◉",
  thread: "◆",
  brief: "◇",
  reminder: "◎",
};

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: 1, type: "brief", text: "Daily brief compiled", time: "08:00" },
  { id: 2, type: "research", text: "Researched L2 narratives", time: "08:02" },
  { id: 3, type: "watchlist", text: "ETH watchlist check", time: "08:05" },
];

export default function ActivityPanel() {
  const [activity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [stats] = useState({
    researches: 12,
    threads: 4,
    watchlistChecks: 28,
    reminders: 2,
  });

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      {/* Stats grid */}
      <div className="panel p-3">
        <div className="mono text-xs text-[var(--text-dim)] uppercase tracking-widest mb-3">
          Session Stats
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Researches", value: stats.researches, color: "var(--accent-blue)" },
            { label: "Threads", value: stats.threads, color: "var(--accent-orange)" },
            { label: "WL Checks", value: stats.watchlistChecks, color: "var(--accent-green)" },
            { label: "Reminders", value: stats.reminders, color: "var(--accent-orange)" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--bg-card)] rounded-sm p-2">
              <div className="mono font-bold text-lg" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="mono text-xs text-[var(--text-dim)] mt-0.5" style={{ fontSize: "10px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="panel flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
          <div className="pulse-dot bg-[var(--accent-green)]" />
          <span className="mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
            Activity Log
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activity.map((item) => (
            <div key={item.id} className="flex items-start gap-2 px-2 py-1.5 rounded-sm slide-up">
              <span className="mono text-xs mt-0.5 flex-shrink-0" style={{ color: typeColor[item.type] }}>
                {typeIcon[item.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="mono text-xs text-[var(--text-secondary)] leading-relaxed truncate">
                  {item.text}
                </div>
                <div className="mono text-xs text-[var(--text-dim)]" style={{ fontSize: "10px" }}>
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nosana node info */}
      <div className="panel p-3">
        <div className="mono text-xs text-[var(--text-dim)] uppercase tracking-widest mb-2">
          Infrastructure
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Network", value: "Nosana", color: "var(--accent-green)" },
            { label: "GPU", value: "nvidia-3090", color: "var(--text-secondary)" },
            { label: "Model", value: "Qwen3:8b", color: "var(--text-secondary)" },
            { label: "Latency", value: "~1.2s", color: "var(--accent-blue)" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="mono text-xs text-[var(--text-dim)]" style={{ fontSize: "10px" }}>
                {item.label}
              </span>
              <span className="mono text-xs font-bold" style={{ color: item.color, fontSize: "10px" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
