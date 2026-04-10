# 🖥️ CryptoDesk — Personal Crypto Intelligence Agent

> Your personal AI-powered crypto operations desk. Research narratives, track your watchlist, draft Twitter threads, and get daily briefings — all from a single terminal interface running on Nosana's decentralized GPU network.

![CryptoDesk Banner](./assets/banner.png)

## 🎥 Demo

- 📹 **[Watch Demo Video](#)** *(add link after recording)*
- 🚀 **[Live on Nosana](#)** *(add deployment URL)*
- 🐦 **[Project Post on X](#)** *(add tweet link)*

---

## 💡 What It Does

CryptoDesk is a personal crypto intelligence agent that acts as your always-on research desk. Instead of scrolling through noisy Twitter feeds and Discord servers, you talk to CryptoDesk and it does the work for you.

### Core Capabilities

| Command | What Happens |
|---|---|
| `brief me` | Full morning briefing: top narratives + watchlist check + reminders |
| `research [topic]` | Deep web research on any crypto narrative with signal/noise separation |
| `check watchlist` | Cross-reference your tracked assets against current news |
| `draft thread about [topic]` | Write a Twitter/X thread in your analytical voice |
| `add [token] to watchlist` | Track a new asset or protocol |
| `remind me to [task] on [date]` | Save governance votes, token unlocks, important dates |

### Why It's Different

Most crypto tools either dump raw data at you or give you generic market summaries. CryptoDesk is **personal** — it knows your watchlist, your reminders, and your context. Everything it surfaces is filtered through what matters *to you specifically*.

---

## 🏗️ Architecture

```
cryptodesk/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── api/
│   │   │   ├── copilotkit/route.ts   # CopilotKit runtime endpoint
│   │   │   └── health/route.ts       # Health check for Nosana
│   │   ├── globals.css               # Dark terminal theme
│   │   ├── copilot-theme.css         # CopilotKit overrides
│   │   └── layout.tsx / page.tsx
│   ├── components/
│   │   ├── CryptoDesk.tsx            # Main 3-panel layout
│   │   ├── Header.tsx                # Live clock + Nosana status
│   │   └── panels/
│   │       ├── WatchlistPanel.tsx    # Watchlist + Reminders sidebar
│   │       └── ActivityPanel.tsx     # Stats + Activity log + Node info
│   └── mastra/
│       ├── index.ts                  # Mastra instance
│       ├── agents/
│       │   └── cryptodesk-agent/
│       │       └── index.ts          # Agent definition + personality
│       └── tools/
│           └── index.ts              # 8 custom tools
├── nos_job_def/
│   └── nosana_mastra.json            # Nosana deployment config
├── Dockerfile                        # Single-container build
├── server.js                         # Production server
└── .env.example
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Mastra](https://mastra.ai) — TypeScript agent framework |
| Frontend | Next.js 15 + React 18 + Tailwind CSS |
| Chat UI | [CopilotKit](https://copilotkit.ai) |
| LLM | Qwen3:8b via Nosana decentralized endpoint |
| Web Search | Serper.dev (with DuckDuckGo fallback) |
| Storage | File-based JSON (watchlist + reminders persist across sessions) |
| Deployment | Docker → Nosana GPU Network |

---

## ⚡ Nosana Integration

CryptoDesk is deployed entirely on Nosana's decentralized GPU infrastructure:

- **LLM Inference** — Qwen3:8b served via Nosana's hosted endpoint
- **Compute** — nvidia-3090 GPU node from Nosana's marketplace
- **Container** — Single Docker image served from Nosana node
- **Always-on** — Persistent deployment with `/api/health` monitoring

The entire AI stack — inference, compute, serving — runs on decentralized infrastructure. No AWS, no GCP, no Azure.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Ollama (for local LLM) — [install here](https://ollama.com)

### Setup

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/agent-challenge
cd agent-challenge

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set your OLLAMA_API_URL

# 4. Pull local model (for development)
ollama pull qwen3:0.6b
ollama serve

# 5. Start development servers
pnpm dev          # Next.js on http://localhost:3000
pnpm dev:agent    # Mastra playground on http://localhost:4111
```

Open [http://localhost:3000](http://localhost:3000) to use CryptoDesk.
Open [http://localhost:4111](http://localhost:4111) for the Mastra agent playground.

### Optional: Enable Live Web Search

For real-time crypto research, add a free [Serper.dev](https://serper.dev) API key to `.env`:

```env
SERPER_API_KEY=your_key_here
```

Without it, the agent falls back to DuckDuckGo instant answers — still functional, just less comprehensive.

---

## 🐳 Docker Deployment

### Build & Test Locally

```bash
# Build
docker build -t yourusername/cryptodesk-agent:latest .

# Test locally
docker run -p 3000:3000 \
  -e OLLAMA_API_URL=https://nosana-endpoint.../api \
  -e MODEL_NAME_AT_ENDPOINT=qwen3:8b \
  -e SERPER_API_KEY=your_key \
  yourusername/cryptodesk-agent:latest

# Visit http://localhost:3000
```

### Push to Docker Hub

```bash
docker login
docker push yourusername/cryptodesk-agent:latest
```

---

## 🌐 Deploy to Nosana

### Step 1: Update Job Definition

Edit `nos_job_def/nosana_mastra.json` — replace the image name:

```json
{
  "image": "yourusername/cryptodesk-agent:latest"
}
```

### Step 2: Deploy via Nosana Dashboard

1. Visit [dashboard.nosana.com/deploy](https://dashboard.nosana.com/deploy)
2. Connect your Solana wallet
3. Click **Expand** → paste contents of `nos_job_def/nosana_mastra.json`
4. Select **nvidia-3090** market
5. Click **Deploy**

### Step 3: Deploy via Nosana CLI

```bash
npm install -g @nosana/cli

nosana job post \
  --file ./nos_job_def/nosana_mastra.json \
  --market nvidia-3090 \
  --timeout 60

# Monitor
nosana job status <job-id>
nosana job logs <job-id>
```

---

## 🛠️ Agent Tools Reference

CryptoDesk has 8 custom Mastra tools:

| Tool | Description |
|---|---|
| `researchNarrativeTool` | Web-searches crypto narratives, returns structured brief with signal/noise separation |
| `watchlistCheckTool` | Scans user's watchlist against current news, returns sentiment-tagged findings |
| `draftThreadTool` | Writes Twitter/X threads in configurable tones (analytical/alpha/educational/contrarian) |
| `dailyBriefTool` | Compiles full morning briefing: narratives + watchlist + reminders + market sentiment |
| `saveToWatchlistTool` | Adds tokens/protocols to persistent watchlist |
| `getWatchlistTool` | Retrieves current watchlist |
| `saveReminderTool` | Saves time-sensitive reminders with due dates |
| `getReminderstool` | Retrieves all pending reminders |

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OLLAMA_API_URL` | Yes | Ollama/Nosana LLM endpoint URL |
| `MODEL_NAME_AT_ENDPOINT` | Yes | Model name (e.g. `qwen3:8b`) |
| `SERPER_API_KEY` | Recommended | Serper.dev key for web search |
| `PORT` | No | Server port (default: 3000) |
| `DATA_DIR` | No | Persistent data directory (default: `/data/cryptodesk`) |

---

## 📸 Screenshots

*Add screenshots of your running agent here*

---

## 🏆 Submission Details

- **Challenge**: Nosana Builders' Challenge — Agents 102
- **Agent**: CryptoDesk — Personal Crypto Intelligence Agent
- **Framework**: Mastra + CopilotKit + Next.js
- **Deployment**: Nosana GPU Network (nvidia-3090)
- **Docker Image**: `yourusername/cryptodesk-agent:latest`
- **GitHub**: `https://github.com/YOUR_USERNAME/agent-challenge`

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ for the Nosana Builders' Challenge*
