"use client";

type NavPage = "home" | "research" | "watchlist" | "reminders";

interface Props {
  activeNav: NavPage;
  setActiveNav: (nav: NavPage) => void;
  watchlistCount: number;
  reminderCount: number;
}

const Icons = {
  home: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5L8 2L14 6.5V13.5C14 13.8 13.8 14 13.5 14H10V10H6V14H2.5C2.2 14 2 13.8 2 13.5V6.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  research: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.4" fill="none"/>
      <path d="M10.5 10.5L13.5 13.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  watchlist: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h7M3 12h5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 9.5l1.5 1.5 2.5-3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  reminders: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5a4.5 4.5 0 0 1 4.5 4.5c0 2 .5 3 1.5 4H2c1-1 1.5-2 1.5-4A4.5 4.5 0 0 1 8 2.5Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <path d="M6.5 11v.5a1.5 1.5 0 0 0 3 0V11" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  sun: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.4" fill="none"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  brain: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3.5C4.5 3.5 3 4.8 3 6.5c0 1 .5 1.8 1.2 2.3C4 9.3 4 10 4 10.5V12h4v-1.5c0-.5 0-1.2-.8-1.7C8 8.3 8 7 8 6c0-1.4-.7-2.5-2-2.5Z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      <path d="M10 3.5c1.5 0 3 1.3 3 3 0 1-.5 1.8-1.2 2.3.2.5.2 1.2.2 1.7V12H8" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      <path d="M6 12v1.5M10 12v1.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  check: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke={color} strokeWidth="1.4" fill="none"/>
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pen: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11 2.5l2.5 2.5-7.5 7.5H3.5V10L11 2.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
      <path d="M9 4.5l2.5 2.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

const NAV: { id: NavPage; label: string; icon: (c: string) => JSX.Element }[] = [
  { id: "home",      label: "Home",      icon: Icons.home },
  { id: "research",  label: "Research",  icon: Icons.research },
  { id: "watchlist", label: "Watchlist", icon: Icons.watchlist },
  { id: "reminders", label: "Reminders", icon: Icons.reminders },
];

const QUICK_ACTIONS = [
  { label: "Brief me",        icon: Icons.sun },
  { label: "Research DeFi",   icon: Icons.brain },
  { label: "Check watchlist", icon: Icons.check },
  { label: "Draft thread",    icon: Icons.pen },
];

const QUICK_PROMPTS: Record<string, string> = {
  "Brief me":        "brief me",
  "Research DeFi":   "research DeFi narratives this week",
  "Check watchlist": "check my watchlist for any significant moves",
  "Draft thread":    "draft a thread about the most important crypto narrative right now",
};

export default function LeftSidebar({ activeNav, setActiveNav, watchlistCount, reminderCount }: Props) {
  return (
    <aside style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", background: "white", borderRight: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>

        <p className="t-label" style={{ padding: "0 12px", marginBottom: "8px" }}>Overview</p>

        {NAV.map(item => {
          const active = activeNav === item.id;
          const color = active ? "var(--accent)" : "var(--text-muted)";
          const badge = item.id === "watchlist" && watchlistCount > 0 ? watchlistCount
            : item.id === "reminders" && reminderCount > 0 ? reminderCount : null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "9px", cursor: "pointer", background: active ? "var(--accent-light)" : "transparent", color: active ? "var(--accent)" : "var(--text-secondary)", fontWeight: active ? 600 : 400, border: "none", borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`, width: "100%", textAlign: "left", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "13px", transition: "all 0.12s ease" }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
            >
              {item.icon(color)}
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge && (
                <span style={{ fontSize: "10px", fontWeight: 700, background: active ? "var(--accent)" : "var(--border)", color: active ? "white" : "var(--text-muted)", borderRadius: "100px", padding: "1px 7px", minWidth: "18px", textAlign: "center" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ height: "1px", background: "var(--border-light)", margin: "14px 12px" }} />

        <p className="t-label" style={{ padding: "0 12px", marginBottom: "8px" }}>Quick actions</p>

        {QUICK_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => {
              window.dispatchEvent(new CustomEvent("cryptodesk-prompt", { detail: { prompt: QUICK_PROMPTS[action.label], title: action.label } }));
            }}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "9px", cursor: "pointer", background: "transparent", color: "var(--text-secondary)", border: "none", borderLeft: "3px solid transparent", width: "100%", textAlign: "left", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "13px", transition: "all 0.12s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            {action.icon("var(--text-muted)")}
            {action.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border-light)", background: "var(--bg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
          <div className="dot dot-green" />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>Nosana Network</span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Decentralized GPU · nvidia-3090</span>
      </div>
    </aside>
  );
}