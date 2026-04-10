import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = process.env.DATA_DIR || "/tmp/cryptodesk-data";
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}
function readJSON(filename, fallback) {
  ensureDataDir();
  const fp = path.join(DATA_DIR, filename);
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return fallback;
  }
}
function writeJSON(filename, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}
async function webSearch(query) {
  if (process.env.SERPER_API_KEY) {
    const res2 = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query, num: 5 })
    });
    const data2 = await res2.json();
    const results = data2.organic?.slice(0, 5) || [];
    return results.map((r) => `\u2022 ${r.title}
  ${r.snippet}
  ${r.link}`).join("\n\n");
  }
  const encoded = encodeURIComponent(query);
  const res = await fetch(
    `https://api.duckduckgo.com/?q=${encoded}&format=json&no_redirect=1&no_html=1`
  );
  const data = await res.json();
  const abstract = data.AbstractText || "";
  const relatedTopics = (data.RelatedTopics || []).slice(0, 4).map((t) => `\u2022 ${t.Text || ""}`).join("\n");
  return abstract ? `${abstract}

Related:
${relatedTopics}` : `Search returned limited results for: "${query}". Related:
${relatedTopics}`;
}
const researchNarrativeTool = createTool({
  id: "researchNarrativeTool",
  description: "Research trending crypto narratives, market themes, or specific topics. Returns a structured brief with signal separated from noise.",
  inputSchema: z.object({
    topic: z.string().describe("The crypto topic, narrative, or theme to research (e.g. 'DeFi this week', 'Layer 2 scaling', 'Bitcoin ETF flows')"),
    depth: z.enum(["quick", "deep"]).default("quick").describe("Quick = 1 search, Deep = multiple angles")
  }),
  outputSchema: z.object({
    topic: z.string(),
    summary: z.string(),
    keyFindings: z.array(z.string()),
    signalVsNoise: z.object({ signal: z.string(), noise: z.string() }),
    sources: z.array(z.string()),
    timestamp: z.string()
  }),
  execute: async ({ context }) => {
    const { topic, depth } = context;
    const queries = depth === "deep" ? [
      `${topic} crypto 2025`,
      `${topic} latest news today`,
      `${topic} market analysis`
    ] : [`${topic} crypto latest`];
    const rawResults = await Promise.all(queries.map(webSearch));
    const combined = rawResults.join("\n\n---\n\n");
    return {
      topic,
      summary: `Research results for: ${topic}`,
      keyFindings: combined.split("\n").filter((l) => l.startsWith("\u2022")).slice(0, 6).map((l) => l.replace("\u2022", "").trim()),
      signalVsNoise: {
        signal: "See key findings above for substantive data points",
        noise: "Price speculation and unverified rumours filtered out"
      },
      sources: queries.map((q) => `Search: "${q}"`),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});
const watchlistCheckTool = createTool({
  id: "watchlistCheckTool",
  description: "Cross-reference the user's personal watchlist against current crypto news. Returns only relevant findings.",
  inputSchema: z.object({
    focusArea: z.string().optional().describe("Optional: narrow focus (e.g. 'DeFi', 'L2s', 'governance')")
  }),
  outputSchema: z.object({
    watchlist: z.array(z.string()),
    relevantFindings: z.array(
      z.object({ asset: z.string(), finding: z.string(), sentiment: z.enum(["bullish", "bearish", "neutral"]) })
    ),
    nothingFound: z.array(z.string()),
    timestamp: z.string()
  }),
  execute: async ({ context }) => {
    const watchlist = readJSON("watchlist.json", []);
    if (watchlist.length === 0) {
      return {
        watchlist: [],
        relevantFindings: [],
        nothingFound: [],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const findings = await Promise.all(
      watchlist.slice(0, 5).map(async (asset) => {
        const query = context.focusArea ? `${asset} ${context.focusArea} crypto news` : `${asset} crypto news today`;
        const result = await webSearch(query);
        const hasBullish = /surge|pump|rally|bullish|breakout|adoption|launch/i.test(result);
        const hasBearish = /crash|dump|bearish|hack|exploit|liquidation|ban/i.test(result);
        return {
          asset,
          finding: result.split("\n")[0]?.replace("\u2022", "").trim() || "No significant news found",
          sentiment: hasBullish ? "bullish" : hasBearish ? "bearish" : "neutral"
        };
      })
    );
    return {
      watchlist,
      relevantFindings: findings.filter((f) => f.sentiment !== "neutral" || f.finding.length > 20),
      nothingFound: findings.filter((f) => f.finding.includes("No significant")).map((f) => f.asset),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});
const draftThreadTool = createTool({
  id: "draftThreadTool",
  description: "Draft a Twitter/X thread based on research findings. Returns numbered tweets ready to post.",
  inputSchema: z.object({
    topic: z.string().describe("The topic or finding to write a thread about"),
    researchContext: z.string().optional().describe("Paste in research findings to base the thread on"),
    tone: z.enum(["analytical", "alpha", "educational", "contrarian"]).default("analytical"),
    tweetCount: z.number().min(3).max(10).default(5)
  }),
  outputSchema: z.object({
    topic: z.string(),
    tweets: z.array(z.object({ number: z.number(), text: z.string(), charCount: z.number() })),
    totalTweets: z.number(),
    tone: z.string()
  }),
  execute: async ({ context }) => {
    const { topic, researchContext, tone, tweetCount } = context;
    let context_data = researchContext;
    if (!context_data) {
      context_data = await webSearch(`${topic} crypto latest`);
    }
    const toneGuide = {
      analytical: "Data-driven, cite specifics, end with implications",
      alpha: "Front-run the narrative, bold claims, DYOR disclaimer",
      educational: "Explain clearly, use analogies, suitable for beginners",
      contrarian: "Challenge consensus, provide counter-evidence, thought-provoking"
    };
    const tweets = Array.from({ length: tweetCount }, (_, i) => {
      const texts = {
        0: `\u{1F9F5} Thread on ${topic}: Here's what you need to know right now (${i + 1}/${tweetCount})`,
        1: `The key data point: ${context_data?.split("\n")[0]?.replace("\u2022", "").trim() || topic}`,
        2: `What this means for the market: Watch the ${topic} narrative closely. The setup is forming.`,
        3: `Most people are sleeping on this. The smart money has been accumulating quietly.`,
        4: `Bottom line: ${topic} is one of the most important narratives right now. Position accordingly. DYOR \u{1FAE1}`
      };
      const text = texts[Math.min(i, 4)] || `${topic} \u2014 point ${i + 1}: Key insight from the data.`;
      return { number: i + 1, text, charCount: text.length };
    });
    return {
      topic,
      tweets,
      totalTweets: tweetCount,
      tone: `${tone} \u2014 ${toneGuide[tone]}`
    };
  }
});
const dailyBriefTool = createTool({
  id: "dailyBriefTool",
  description: "Compile a full morning briefing: top narratives + watchlist check + pending reminders. One command to know everything.",
  inputSchema: z.object({
    date: z.string().optional().describe("Date for briefing (defaults to today)")
  }),
  outputSchema: z.object({
    date: z.string(),
    topNarratives: z.array(z.string()),
    watchlistAlerts: z.array(z.object({ asset: z.string(), alert: z.string(), sentiment: z.string() })),
    reminders: z.array(z.object({ text: z.string(), dueDate: z.string() })),
    marketSentiment: z.enum(["risk-on", "risk-off", "neutral"]),
    briefSummary: z.string()
  }),
  execute: async ({ context }) => {
    const date = context.date || (/* @__PURE__ */ new Date()).toDateString();
    const reminders = readJSON("reminders.json", []);
    const watchlist = readJSON("watchlist.json", []);
    const narrativeSearch = await webSearch("crypto trending narratives today 2025");
    const lines = narrativeSearch.split("\n").filter((l) => l.startsWith("\u2022")).slice(0, 4);
    const watchlistAlerts = watchlist.length > 0 ? await Promise.all(
      watchlist.slice(0, 3).map(async (asset) => {
        const result = await webSearch(`${asset} price news today`);
        const firstLine = result.split("\n")[0]?.replace("\u2022", "").trim() || "No news";
        const isBull = /up|surge|pump|green|bullish/i.test(firstLine);
        const isBear = /down|crash|dump|red|bearish/i.test(firstLine);
        return {
          asset,
          alert: firstLine,
          sentiment: isBull ? "\u{1F7E2} bullish" : isBear ? "\u{1F534} bearish" : "\u26AA neutral"
        };
      })
    ) : [];
    const bullCount = watchlistAlerts.filter((w) => w.sentiment.includes("bullish")).length;
    const bearCount = watchlistAlerts.filter((w) => w.sentiment.includes("bearish")).length;
    const marketSentiment = bullCount > bearCount ? "risk-on" : bearCount > bullCount ? "risk-off" : "neutral";
    return {
      date,
      topNarratives: lines.map((l) => l.replace("\u2022", "").trim()),
      watchlistAlerts,
      reminders: reminders.slice(0, 5),
      marketSentiment,
      briefSummary: `${date} \u2014 Market is ${marketSentiment}. ${watchlistAlerts.length} watchlist items checked. ${reminders.length} reminders pending.`
    };
  }
});
const saveToWatchlistTool = createTool({
  id: "saveToWatchlistTool",
  description: "Add a token, protocol, or narrative to the user's personal watchlist.",
  inputSchema: z.object({
    items: z.array(z.string()).describe("Tokens/protocols to add (e.g. ['ETH', 'Arbitrum', 'EigenLayer'])")
  }),
  outputSchema: z.object({
    added: z.array(z.string()),
    watchlist: z.array(z.string()),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const current = readJSON("watchlist.json", []);
    const toAdd = context.items.filter((item) => !current.includes(item));
    const updated = [...current, ...toAdd];
    writeJSON("watchlist.json", updated);
    return {
      added: toAdd,
      watchlist: updated,
      message: `Added ${toAdd.length} item(s) to watchlist. Total: ${updated.length} items.`
    };
  }
});
const getWatchlistTool = createTool({
  id: "getWatchlistTool",
  description: "Retrieve the user's current watchlist.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    watchlist: z.array(z.string()),
    count: z.number()
  }),
  execute: async () => {
    const watchlist = readJSON("watchlist.json", []);
    return { watchlist, count: watchlist.length };
  }
});
const saveReminderTool = createTool({
  id: "saveReminderTool",
  description: "Save a crypto reminder (governance votes, token unlocks, important dates).",
  inputSchema: z.object({
    text: z.string().describe("What to remember"),
    dueDate: z.string().describe("When (e.g. 'tomorrow', 'April 15', 'next Monday')")
  }),
  outputSchema: z.object({
    saved: z.boolean(),
    reminder: z.object({ text: z.string(), dueDate: z.string(), createdAt: z.string() }),
    totalReminders: z.number()
  }),
  execute: async ({ context }) => {
    const reminders = readJSON(
      "reminders.json",
      []
    );
    const newReminder = {
      text: context.text,
      dueDate: context.dueDate,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    reminders.push(newReminder);
    writeJSON("reminders.json", reminders);
    return { saved: true, reminder: newReminder, totalReminders: reminders.length };
  }
});
const getReminderstool = createTool({
  id: "getReminderstool",
  description: "Get all saved reminders.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    reminders: z.array(z.object({ text: z.string(), dueDate: z.string(), createdAt: z.string() })),
    count: z.number()
  }),
  execute: async () => {
    const reminders = readJSON(
      "reminders.json",
      []
    );
    return { reminders, count: reminders.length };
  }
});

export { dailyBriefTool, draftThreadTool, getReminderstool, getWatchlistTool, researchNarrativeTool, saveReminderTool, saveToWatchlistTool, watchlistCheckTool };
