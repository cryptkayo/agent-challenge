"use client";

interface HeaderProps {
  time: string;
  nosanaStatus: "online" | "connecting" | "offline";
}

export default function Header({ time, nosanaStatus }: HeaderProps) {
  const statusColor = {
    online: "var(--accent-green)",
    connecting: "var(--accent-orange)",
    offline: "var(--accent-red)",
  }[nosanaStatus];

  const statusLabel = {
    online: "NOSANA · LIVE",
    connecting: "NOSANA · CONNECTING",
    offline: "NOSANA · OFFLINE",
  }[nosanaStatus];

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] relative z-10 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="var(--accent-green)" strokeWidth="1.5" fill="none"/>
            <path d="M12 2L12 22" stroke="var(--accent-green)" strokeWidth="0.5" strokeDasharray="2 2"/>
            <path d="M2 7L22 17" stroke="var(--accent-green)" strokeWidth="0.5" strokeDasharray="2 2"/>
            <path d="M22 7L2 17" stroke="var(--accent-green)" strokeWidth="0.5" strokeDasharray="2 2"/>
            <circle cx="12" cy="12" r="2" fill="var(--accent-green)"/>
          </svg>
          <span className="font-['Syne'] font-800 text-base tracking-wider" style={{ color: "var(--accent-green)" }}>
            CRYPTO<span style={{ color: "var(--text-primary)" }}>DESK</span>
          </span>
        </div>
        <div className="h-4 w-px bg-[var(--border)]" />
        <span className="mono text-xs text-[var(--text-dim)]">personal intelligence agent</span>
      </div>

      {/* Center: market status tags */}
      <div className="flex items-center gap-2">
        <span className="tag tag-dim">BTC</span>
        <span className="tag tag-green">ETH</span>
        <span className="tag tag-blue">DEFI</span>
        <span className="tag tag-orange">L2</span>
      </div>

      {/* Right: system status */}
      <div className="flex items-center gap-4">
        {/* Nosana status */}
        <div className="flex items-center gap-2 panel px-3 py-1">
          <div
            className="pulse-dot"
            style={{ background: statusColor }}
          />
          <span className="mono text-xs" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        {/* Live clock */}
        <div className="mono text-xs text-[var(--text-dim)]">{time} UTC</div>
      </div>
    </header>
  );
}
