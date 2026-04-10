"use client";

interface WatchlistItem { symbol: string; sentiment: "bullish" | "bearish" | "neutral"; change: string; changeColor: string; }
interface Reminder { text: string; dueDate: string; status: "today" | "upcoming" | "done"; }

interface Props {
  watchlist: WatchlistItem[];
  reminders: Reminder[];
  newAsset: string;
  setNewAsset: (v: string) => void;
  onAddAsset: (sym: string) => void;
  onCheckAsset: (sym: string) => void;
  inputFocused: boolean;
  setInputFocused: (v: boolean) => void;
}

const SENTIMENT = {
  bullish: { label: "↑", color: "#12B76A", bg: "#ECFDF5" },
  bearish: { label: "↓", color: "#F04438", bg: "#FEF3F2" },
  neutral: { label: "–",  color: "#9BA5B8", bg: "#F8F9FC" },
};

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  BTC: { bg: "#FFF7ED", color: "#EA580C" }, ETH: { bg: "#EEF2FF", color: "#4F46E5" },
  SOL: { bg: "#F0FDF4", color: "#16A34A" }, ARB: { bg: "#EFF6FF", color: "#2563EB" },
  DEFAULT: { bg: "#EEF1FF", color: "#4F6EF7" },
};

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  today:    { label: "Today",    bg: "#FEF3F2", color: "#F04438" },
  upcoming: { label: "Upcoming", bg: "#EEF1FF", color: "#4F6EF7" },
  done:     { label: "Done",     bg: "#ECFDF5", color: "#12B76A" },
};

export default function RightPanel({ watchlist, reminders, newAsset, setNewAsset, onAddAsset, onCheckAsset, inputFocused, setInputFocused }: Props) {
  return (
    <aside style={{ width: "272px", flexShrink: 0, display: "flex", flexDirection: "column", background: "white", borderLeft: "1px solid var(--border)", overflowY: "auto" }}>
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "22px" }}>

        {/* Watchlist */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p className="t-label">Watchlist</p>
            {watchlist.length > 0 && <span className="badge badge-blue">{watchlist.length}</span>}
          </div>
          <div style={{ background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
            {watchlist.length === 0 ? (
              <div style={{ padding: "22px 16px", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #EEF1FF, #D6DDFB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 12px", border: "1px solid var(--accent-mid)" }}>📋</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>No assets tracked</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>Add tokens below to monitor them</div>
              </div>
            ) : watchlist.map((item, i) => {
              const s = SENTIMENT[item.sentiment];
              const ic = ICON_COLORS[item.symbol] || ICON_COLORS.DEFAULT;
              return (
                <div key={item.symbol} onClick={() => onCheckAsset(item.symbol)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderBottom: i < watchlist.length - 1 ? "1px solid var(--border-light)" : "none", cursor: "pointer", transition: "background 0.12s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: ic.color, flexShrink: 0 }}>
                    {item.symbol.slice(0, 3)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{item.symbol}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tap to check news</div>
                  </div>
                  <div style={{ padding: "2px 8px", borderRadius: "100px", background: s.bg, fontSize: "11px", fontWeight: 700, color: s.color }}>{s.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", background: inputFocused ? "white" : "var(--bg)", border: `1px solid ${inputFocused ? "var(--accent-mid)" : "var(--border)"}`, borderRadius: "9px", padding: "8px 12px", boxShadow: inputFocused ? "0 0 0 3px rgba(79,110,247,0.1)" : "var(--shadow-input)", transition: "all 0.15s ease" }}>
              <input value={newAsset} onChange={e => setNewAsset(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { onAddAsset(newAsset); setNewAsset(""); } }}
                onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                placeholder="Add asset e.g. ETH, SOL..."
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "12px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)" }} />
            </div>
            <button onClick={() => { onAddAsset(newAsset); setNewAsset(""); }} className="btn-accent" style={{ padding: "8px 13px", fontSize: "12px" }}>Add</button>
          </div>
        </div>

        {/* Reminders */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p className="t-label">Reminders</p>
            {reminders.length > 0 && <span className="badge badge-orange">{reminders.length}</span>}
          </div>
          <div style={{ background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
            {reminders.length === 0 ? (
              <div style={{ padding: "16px" }}>
                <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "12px 14px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7, fontStyle: "italic", border: "1px dashed var(--border)" }}>
                  "Remind me to check ARB governance vote on Friday"
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", textAlign: "center" }}>Go to Reminders page to add one</div>
              </div>
            ) : reminders.map((r, i) => {
              const st = STATUS_STYLE[r.status] || STATUS_STYLE.upcoming;
              return (
                <div key={i} style={{ padding: "12px 14px", borderBottom: i < reminders.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", flex: 1 }}>{r.text}</div>
                    <span style={{ padding: "2px 8px", borderRadius: "100px", background: st.bg, fontSize: "10px", fontWeight: 700, color: st.color, flexShrink: 0 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--orange)", marginTop: "4px", fontWeight: 600 }}>⏰ {r.dueDate}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <p className="t-label" style={{ marginBottom: "10px" }}>Infrastructure</p>
          <div style={{ background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
              <div className="dot dot-green" />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>All systems normal</span>
            </div>
            {[["Network","Nosana · Decentralized"],["Model","Qwen3:8b"],["Compute","nvidia-3090 GPU"],["Uptime","99.9%"]].map(([label, value], i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}