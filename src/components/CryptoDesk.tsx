"use client";
import { useState, useEffect } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import LeftSidebar from "./panels/LeftSidebar";
import RightPanel from "./panels/RightPanel";

export interface WatchlistItem {
  symbol: string;
  sentiment: "bullish" | "bearish" | "neutral";
  change: string;
  changeColor: string;
}

export interface Reminder {
  text: string;
  dueDate: string;
  status: "today" | "upcoming" | "done";
}

export type NavPage = "home" | "research" | "watchlist" | "reminders";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingLine(greeting: string) {
  if (greeting === "Good morning") return `${greeting}, Kayo. Your market is ready.`;
  if (greeting === "Good afternoon") return `${greeting}, Kayo. Here's your market.`;
  return `${greeting}, Kayo. Here's your market.`;
}

const ActionIcons = {
  analyze: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  market: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 12L6 7.5L9.5 10L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 4h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  watchlist: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 9.5l1.5 1.5 2.5-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  alpha: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 11l-3.7 2.5 1.4-4.3L2 6.5h4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  back: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13 7.5H2M2 7.5L7 2.5M2 7.5L7 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const QUICK_ACTIONS = [
  { label: "Analyze token",   prompt: "analyze the top performing crypto token today",               icon: ActionIcons.analyze,   chatTitle: "Token Analysis" },
  { label: "Market brief",    prompt: "give me a full market brief for today",                       icon: ActionIcons.market,    chatTitle: "Market Brief" },
  { label: "Check watchlist", prompt: "check my watchlist for any significant moves",                icon: ActionIcons.watchlist, chatTitle: "Watchlist Check" },
  { label: "Find alpha",      prompt: "find the best crypto opportunities and narratives right now", icon: ActionIcons.alpha,     chatTitle: "Alpha Hunt" },
];

const SUGGESTED_PROMPTS = [
  "What's moving the market today?",
  "Top 3 altcoins to watch this week",
  "Is SOL overvalued right now?",
  "Best DeFi plays this week",
  "Analyze ETH for a swing trade",
  "What narratives are gaining momentum?",
  "Draft a thread about Bitcoin dominance",
];

export default function CryptoDesk() {
  const [time, setTime] = useState("--:--:-- UTC");
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState<NavPage>("home");
  const [greeting, setGreeting] = useState("Good morning");
  const [chatStarted, setChatStarted] = useState(false);
  const [chatTitle, setChatTitle] = useState("Chat");

  // localStorage-persisted state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cryptodesk-watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cryptodesk-reminders");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [newAsset, setNewAsset] = useState("");
  const [newReminder, setNewReminder] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const handlePrompt = (prompt: string, title = "Chat") => {
    setChatTitle(title);
    setChatStarted(true);
    setActiveNav("home");
    setTimeout(() => {
      const textarea = document.querySelector(".cryptodesk-chat textarea") as HTMLTextAreaElement;
      if (textarea) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        setter?.call(textarea, prompt);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        const form = textarea.closest("form");
        if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
    }, 150);
  };

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) + " UTC");
    };
    tick();
    const id = setInterval(tick, 1000);
    const handleSidebarPrompt = (e: Event) => {
      const { prompt, title } = (e as CustomEvent).detail;
      handlePrompt(prompt, title);
    };
    window.addEventListener("cryptodesk-prompt", handleSidebarPrompt);
    return () => {
      clearInterval(id);
      window.removeEventListener("cryptodesk-prompt", handleSidebarPrompt);
    };
  }, []);

  // Persist watchlist and reminders to localStorage
  useEffect(() => {
    localStorage.setItem("cryptodesk-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("cryptodesk-reminders", JSON.stringify(reminders));
  }, [reminders]);

  if (!mounted) return null;

  const handleBack = () => {
    setChatStarted(false);
    setChatTitle("Chat");
  };

  const addWatchlistItem = (symbol: string) => {
    if (!symbol.trim()) return;
    const sym = symbol.trim().toUpperCase();
    if (watchlist.find(w => w.symbol === sym)) return;
    setWatchlist(p => [...p, { symbol: sym, sentiment: "neutral", change: "–", changeColor: "var(--text-muted)" }]);
  };

  const removeWatchlistItem = (symbol: string) => {
    setWatchlist(p => p.filter(w => w.symbol !== symbol));
  };

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders(p => [...p, { text: newReminder.trim(), dueDate: newDueDate || "No date set", status: "upcoming" }]);
    setNewReminder("");
    setNewDueDate("");
  };

  const removeReminder = (i: number) => {
    setReminders(p => p.filter((_, idx) => idx !== i));
  };

  const heroStatus = [
    { text: "Agent is online · connected to Nosana GPU network", color: "var(--green)" },
    {
      text: watchlist.length > 0 ? `${watchlist.length} asset${watchlist.length > 1 ? "s" : ""} on your watchlist` : "No assets on your watchlist yet",
      color: watchlist.length > 0 ? "var(--accent)" : "var(--text-muted)",
    },
    {
      text: reminders.length > 0 ? `${reminders.length} reminder${reminders.length > 1 ? "s" : ""} saved` : "No reminders set yet",
      color: reminders.length > 0 ? "var(--orange)" : "var(--text-muted)",
    },
  ];

  const panelProps = { watchlist, setWatchlist, reminders, setReminders, addWatchlistItem, removeWatchlistItem, addReminder, removeReminder, newAsset, setNewAsset, newReminder, setNewReminder, newDueDate, setNewDueDate, handlePrompt, inputFocused, setInputFocused };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "60px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #4F6EF7 0%, #7B9FFF 100%)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(79,110,247,0.3)", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M8.5 1.5L2.5 5V12L8.5 15.5L14.5 12V5L8.5 1.5Z" stroke="white" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
              <circle cx="8.5" cy="8.5" r="2" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.2 }}>CryptoDesk</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Personal Intelligence Agent</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>{greeting}</span>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="dot dot-green" />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Nosana · Live</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={(nav) => { setActiveNav(nav); setChatStarted(false); }}
          watchlistCount={watchlist.length}
          reminderCount={reminders.length}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)", minHeight: 0 }}>

          {/* HOME */}
          {activeNav === "home" && !chatStarted && (
            <div style={{ flex: 1, overflowY: "scroll", overflowX: "hidden", padding: "28px 32px", display: "flex", flexDirection: "column", gap: "12px" }}>

              <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(15,23,42,0.06)", flexShrink: 0 }}>
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "13px", background: "linear-gradient(135deg, #4F6EF7, #7B9FFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", boxShadow: "0 4px 12px rgba(79,110,247,0.25)", position: "relative", flexShrink: 0 }}>
                      🤖
                      <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "12px", height: "12px", borderRadius: "50%", background: "var(--green)", border: "2px solid white" }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>CryptoDesk Agent</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>Personal Intelligence Agent</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 14px", background: "var(--green-light)", borderRadius: "100px" }}>
                    <div className="dot dot-green" style={{ width: "6px", height: "6px" }} />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--green-dark)" }}>Online</span>
                  </div>
                </div>

                <div style={{ height: "1px", background: "var(--border-light)", margin: "0 24px" }} />

                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "21px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "18px", lineHeight: 1.3 }}>
                    {getGreetingLine(greeting)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                    {heroStatus.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, flexShrink: 0, boxShadow: `0 0 0 3px ${item.color}20` }} />
                        <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: "1px", background: "var(--border-light)", margin: "0 24px" }} />

                <div style={{ padding: "16px 24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handlePrompt(action.prompt, action.chatTitle)}
                      style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "100px", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s ease", fontFamily: "Plus Jakarta Sans, sans-serif", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent-mid)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(79,110,247,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)"; }}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 4px", flexShrink: 0 }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>or start a conversation</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
              </div>

              <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(15,23,42,0.08)", overflow: "hidden", flexShrink: 0 }}>
                <div style={{ padding: "20px 24px", borderLeft: "3px solid var(--accent)" }}>
                  <CommandInput onSubmit={(p) => handlePrompt(p, "Chat")} />
                </div>
                <div style={{ height: "1px", background: "var(--border-light)" }} />
                <div style={{ padding: "16px 24px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.04em", marginBottom: "10px" }}>Try asking:</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {SUGGESTED_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => handlePrompt(p, "Chat")}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "9px", fontSize: "13px", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.12s ease", fontFamily: "Plus Jakarta Sans, sans-serif", textAlign: "left", width: "100%" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent-mid)"; e.currentTarget.style.paddingLeft = "16px"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.paddingLeft = "14px"; }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ height: "16px", flexShrink: 0 }} />
            </div>
          )}

          {/* CHAT VIEW */}
          {chatStarted && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <div style={{ padding: "14px 24px", background: "white", borderBottom: "1px solid var(--border)", flexShrink: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={handleBack}
                  style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s ease", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent-mid)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {ActionIcons.back}
                </button>
                <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #4F6EF7, #7B9FFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🤖</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{chatTitle}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>CryptoDesk Agent · Nosana</div>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "var(--green-light)", borderRadius: "100px" }}>
                  <div className="dot dot-green" style={{ width: "5px", height: "5px" }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--green-dark)" }}>Online</span>
                </div>
              </div>
              <div className="cryptodesk-chat" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <CopilotChat
                  className="h-full"
                  instructions="You are CryptoDesk, a personal crypto intelligence agent. Respond in clear plain English. No jargon. Be concise. Always end with a 💡 Action the user should take next."
                  labels={{
                    title: "",
                    initial: `${greeting}, Kayo. I'm **CryptoDesk** — ready to help. What would you like to know?`,
                    placeholder: "Ask your agent anything...",
                  }}
                />
              </div>
            </div>
          )}

          {/* RESEARCH PAGE */}
          {activeNav === "research" && !chatStarted && (
            <ResearchPage onPrompt={(p) => handlePrompt(p, "Research")} />
          )}

          {/* WATCHLIST PAGE */}
          {activeNav === "watchlist" && !chatStarted && (
            <WatchlistPage {...panelProps} />
          )}

          {/* REMINDERS PAGE */}
          {activeNav === "reminders" && !chatStarted && (
            <RemindersPage {...panelProps} />
          )}

        </main>

        <RightPanel
          watchlist={watchlist}
          reminders={reminders}
          newAsset={newAsset}
          setNewAsset={setNewAsset}
          onAddAsset={addWatchlistItem}
          onCheckAsset={(sym) => handlePrompt(`check ${sym} latest news and price action`, `${sym} Check`)}
          inputFocused={inputFocused}
          setInputFocused={setInputFocused}
        />
      </div>
    </div>
  );
}

function CommandInput({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;

  const handleSubmit = () => {
    if (!hasValue) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`, borderRadius: "12px", padding: "14px 16px", background: focused ? "white" : "var(--bg)", boxShadow: focused ? "0 0 0 4px rgba(79,110,247,0.1), 0 2px 8px rgba(15,23,42,0.06)" : "0 1px 3px rgba(15,23,42,0.05)", transition: "all 0.15s ease", marginBottom: "8px", minHeight: "52px" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
          <path d="M15 11.5a2 2 0 0 1-2 2H5.5L2.5 16.5V4a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v7.5Z" stroke="var(--text-primary)" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
        </svg>
        <input value={value} onChange={e => setValue(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="Ask CryptoDesk anything..."
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)" }} />
        <button onClick={handleSubmit}
          style={{ width: "36px", height: "36px", borderRadius: "10px", background: hasValue ? "var(--accent)" : "var(--border)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: hasValue ? "pointer" : "default", transition: "all 0.15s ease", flexShrink: 0, boxShadow: hasValue ? "0 2px 6px rgba(79,110,247,0.3)" : "none" }}
          onMouseEnter={e => { if (hasValue) { e.currentTarget.style.background = "var(--accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
          onMouseLeave={e => { if (hasValue) { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 7.5H13M13 7.5L8 2.5M13 7.5L8 12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", paddingLeft: "2px" }}>
        Try: <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>"Analyze ETH for a swing trade"</span>
      </div>
    </div>
  );
}

function ResearchPage({ onPrompt }: { onPrompt: (p: string) => void }) {
  const topics = [
    { label: "DeFi Narratives",    desc: "Latest trends in decentralized finance",     prompt: "research the top DeFi narratives this week",                                       icon: "📈" },
    { label: "Layer 2 Ecosystem",  desc: "Activity across Arbitrum, Base, Optimism",   prompt: "research Layer 2 ecosystem activity and narratives this week",                    icon: "⚡" },
    { label: "Bitcoin Dominance",  desc: "BTC market share and implications",          prompt: "analyze Bitcoin dominance and what it means for altcoins right now",             icon: "₿" },
    { label: "AI x Crypto",        desc: "AI tokens and narrative strength",           prompt: "research AI crypto tokens and narratives this week",                             icon: "🤖" },
    { label: "Meme Season Check",  desc: "Is meme coin season here or over?",         prompt: "analyze whether meme coin season is active or dying right now",                   icon: "🐸" },
    { label: "Macro Impact",       desc: "How macro events affect crypto",             prompt: "explain how current macro economic conditions are affecting crypto markets",      icon: "🌐" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>Research</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Pick a topic and let the agent research it for you in real time.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {topics.map(t => (
          <button key={t.label} onClick={() => onPrompt(t.prompt)}
            style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "18px 20px", background: "white", border: "1px solid var(--border)", borderRadius: "14px", cursor: "pointer", transition: "all 0.15s ease", textAlign: "left", boxShadow: "0 1px 3px rgba(15,23,42,0.05)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-mid)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,110,247,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{t.icon}</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{t.label}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WatchlistPage({ watchlist, newAsset, setNewAsset, addWatchlistItem, removeWatchlistItem, handlePrompt, inputFocused, setInputFocused }: any) {
  const ICON_COLORS: Record<string, { bg: string; color: string }> = {
    BTC: { bg: "#FFF7ED", color: "#EA580C" }, ETH: { bg: "#EEF2FF", color: "#4F46E5" },
    SOL: { bg: "#F0FDF4", color: "#16A34A" }, ARB: { bg: "#EFF6FF", color: "#2563EB" },
    DEFAULT: { bg: "#EEF1FF", color: "#4F6EF7" },
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>Watchlist</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Track tokens and protocols. Click any asset to get the latest news.</div>
      </div>
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", padding: "16px 20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}>Add Asset</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "var(--bg)", border: `1.5px solid ${inputFocused ? "var(--accent)" : "var(--border)"}`, borderRadius: "9px", padding: "10px 14px", boxShadow: inputFocused ? "0 0 0 3px rgba(79,110,247,0.1)" : "none", transition: "all 0.15s ease" }}>
            <input value={newAsset} onChange={e => setNewAsset(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { addWatchlistItem(newAsset); setNewAsset(""); } }} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} placeholder="Enter token symbol e.g. ETH, SOL, ARB..."
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "13px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)" }} />
          </div>
          <button onClick={() => { addWatchlistItem(newAsset); setNewAsset(""); }} className="btn-accent" style={{ padding: "10px 20px", fontSize: "13px" }}>Add</button>
        </div>
      </div>
      {watchlist.length === 0 ? (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", padding: "40px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>No assets tracked yet</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Add tokens above to start monitoring them</div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          {watchlist.map((item: WatchlistItem, i: number) => {
            const ic = ICON_COLORS[item.symbol] || ICON_COLORS.DEFAULT;
            return (
              <div key={item.symbol} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: i < watchlist.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: ic.color, flexShrink: 0 }}>{item.symbol.slice(0, 3)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{item.symbol}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Click to check news</div>
                </div>
                <button onClick={() => handlePrompt(`check ${item.symbol} latest news and price action`, `${item.symbol} Check`)}
                  style={{ padding: "6px 14px", background: "var(--accent-light)", border: "1px solid var(--accent-mid)", borderRadius: "8px", fontSize: "12px", fontWeight: 500, color: "var(--accent)", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent)"; }}>
                  Check news
                </button>
                <button onClick={() => removeWatchlistItem(item.symbol)}
                  style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px", transition: "all 0.12s ease", fontFamily: "sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RemindersPage({ reminders, newReminder, setNewReminder, newDueDate, setNewDueDate, addReminder, removeReminder }: any) {
  const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
    today:    { label: "Today",    bg: "var(--red-light)",    color: "var(--red)" },
    upcoming: { label: "Upcoming", bg: "var(--accent-light)", color: "var(--accent)" },
    done:     { label: "Done",     bg: "var(--green-light)",  color: "var(--green-dark)" },
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>Reminders</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Set reminders for governance votes, token unlocks, and key dates.</div>
      </div>
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", padding: "18px 20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "12px" }}>New Reminder</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input value={newReminder} onChange={e => setNewReminder(e.target.value)} onKeyDown={e => e.key === "Enter" && addReminder()} placeholder="What do you want to remember?"
            style={{ width: "100%", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)", outline: "none", transition: "border-color 0.15s" }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"} onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
              style={{ flex: 1, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)", outline: "none", transition: "border-color 0.15s" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"} onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
            <button onClick={addReminder} className="btn-accent" style={{ padding: "10px 20px", fontSize: "13px" }}>Save</button>
          </div>
        </div>
      </div>
      {reminders.length === 0 ? (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", padding: "40px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔔</div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>No reminders yet</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Add reminders for governance votes, unlocks, and key dates</div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          {reminders.map((r: Reminder, i: number) => {
            const st = STATUS_STYLE[r.status] || STATUS_STYLE.upcoming;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: i < reminders.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>⏰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "3px" }}>{r.text}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.dueDate}</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: "100px", background: st.bg, fontSize: "11px", fontWeight: 600, color: st.color }}>{st.label}</span>
                <button onClick={() => removeReminder(i)}
                  style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px", transition: "all 0.12s ease", fontFamily: "sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
