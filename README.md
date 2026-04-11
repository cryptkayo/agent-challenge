# CryptoDesk — Personal Crypto Intelligence Agent

> A personal AI agent that helps crypto-native users cut through market noise, track their portfolio, and stay on top of what matters — built on Nosana's decentralized GPU network.

---

## What is CryptoDesk?

CryptoDesk is a personal crypto intelligence agent built for the Nosana Builders Challenge. It combines a clean, purpose-built dashboard with an AI agent that understands crypto — narratives, DeFi, market structure, and more.

Think of it as your personal crypto analyst that's always online, always ready, and runs on decentralized infrastructure.

---

## Features

- **AI Chat Agent** — Ask anything crypto-related and get concise, actionable responses
- **Personal Watchlist** — Track tokens and protocols, persisted across sessions
- **Reminders** — Set reminders for governance votes, token unlocks, and key dates
- **Research Hub** — One-click research on DeFi narratives, Layer 2, Bitcoin dominance, AI tokens, and more
- **Quick Actions** — Market brief, token analysis, alpha hunting, watchlist check
- **Persistent Storage** — Watchlist and reminders saved to localStorage, survive page reloads
- **Nosana Integration** — Deployed on Nosana's decentralized GPU network

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, Tailwind CSS |
| AI Agent | Mastra, CopilotKit |
| LLM | Qwen3 via Nosana decentralized inference |
| Deployment | Nosana GPU Network (nvidia-3090) |
| Container | Docker |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for deployment)
- Ollama (for local development)

### Local Development

```bash
# Clone the repo
git clone https://github.com/cryptkayo/agent-challenge
cd agent-challenge

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Pull the local model (for development)
ollama pull qwen3:0.6b

# Start both servers
pnpm dev        # Frontend on port 3000
pnpm dev:agent  # Mastra agent on port 4111
```

Open [http://localhost:3000](http://localhost:3000) to see CryptoDesk.

### Environment Variables

```env
# For local development with Ollama
OPENAI_API_KEY=ollama
OLLAMA_API_URL=http://127.0.0.1:11434/v1
MODEL_NAME_AT_ENDPOINT=qwen3:0.6b

# For Nosana deployment
OPENAI_API_KEY=nosana
OPENAI_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/v1
MODEL_NAME=qwen3:8b

PORT=4111
NODE_ENV=development
DATA_DIR=/data/cryptodesk
COPILOTKIT_RUNTIME_URL=http://localhost:4111/api/copilotkit
```

---

## Docker Deployment

```bash
# Build the image
docker build -t cryptokayo/agent-challenge:latest .

# Test locally
docker run -p 3000:3000 --env-file .env cryptokayo/agent-challenge:latest

# Push to Docker Hub
docker push cryptokayo/agent-challenge:latest
```

---

## Nosana Deployment

CryptoDesk runs on Nosana's decentralized GPU network. The job definition is in `nos_job_def/nosana_mastra_job_definition.json`.

### Deploy via Nosana Dashboard

1. Visit [dashboard.nosana.com](https://dashboard.nosana.com)
2. Connect your Solana wallet
3. Click **Expand** to open the job editor
4. Paste the contents of `nos_job_def/nosana_mastra_job_definition.json`
5. Select `nvidia-3090` compute market
6. Click **Deploy**

### Deploy via Nosana CLI

```bash
npm install -g @nosana/cli

nosana job post \
  --file ./nos_job_def/nosana_mastra_job_definition.json \
  --market nvidia-3090 \
  --timeout 30 \
  --api <YOUR_API_KEY>
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CryptoDesk                       │
├──────────────┬──────────────────┬───────────────────┤
│  Left Panel  │   Main Content   │   Right Panel     │
│  Navigation  │  Home / Chat /   │  Watchlist        │
│  Quick Acts  │  Research /      │  Reminders        │
│              │  Watchlist /     │  Infrastructure   │
│              │  Reminders       │                   │
└──────────────┴────────┬─────────┴───────────────────┘
                        │
              ┌─────────▼──────────┐
              │   CopilotKit RT    │
              │   /api/copilotkit  │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │   Mastra Agent     │
              │   port 4111        │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │  Nosana GPU Node   │
              │  qwen3:8b          │
              │  nvidia-3090       │
              └────────────────────┘
```

---

## Project Structure

```
agent-challenge/
├── src/
│   ├── app/
│   │   ├── api/copilotkit/     # CopilotKit API route
│   │   ├── globals.css         # CSS variables and utilities
│   │   ├── copilot-theme.css   # CopilotKit chat styling
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/
│   │   ├── CryptoDesk.tsx      # Main app component
│   │   └── panels/
│   │       ├── LeftSidebar.tsx # Navigation panel
│   │       └── RightPanel.tsx  # Watchlist & reminders panel
│   └── mastra/
│       ├── agents/
│       │   └── cryptodesk-agent/ # Agent definition
│       ├── tools/              # Custom agent tools
│       └── index.ts            # Mastra instance
├── nos_job_def/                # Nosana deployment config
├── Dockerfile                  # Container configuration
└── .env.example                # Environment template
```

---

## Roadmap

- [ ] Web search integration for real-time market data
- [ ] Multi-user support with Supabase authentication
- [ ] Price alerts and push notifications
- [ ] Portfolio P&L tracking
- [ ] Twitter/X thread publishing directly from the agent
- [ ] Mobile responsive design

---

## Built With

- [Mastra](https://mastra.ai) — AI agent framework
- [CopilotKit](https://copilotkit.ai) — Frontend AI integration
- [Next.js](https://nextjs.org) — React framework
- [Nosana](https://nosana.com) — Decentralized GPU compute

---

## Author

Built by [@cryptkayo](https://github.com/cryptkayo) for the Nosana Builders Challenge — Agent 102.

---

*Deployed on Nosana · Built with Mastra · Powered by decentralized AI*
