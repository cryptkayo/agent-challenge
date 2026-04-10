import { Agent } from "@mastra/core/agent";
import { createOpenAI } from "@ai-sdk/openai";

const rawURL = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434/v1";
const baseURL = rawURL.endsWith("/v1")
  ? rawURL
  : rawURL.replace(/\/api$/, "/v1").replace(/\/$/, "") + "/v1";

const openaiCompatible = createOpenAI({
  baseURL,
  apiKey: process.env.OPENAI_API_KEY || "ollama",
});

const model = openaiCompatible(
  process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:0.6b"
);

export const cryptoDeskAgent = new Agent({
  name: "CryptoDesk",
  instructions: `You are CryptoDesk — a sharp, no-nonsense personal crypto intelligence agent. You help crypto-native users cut through market noise and stay on top of what matters. Be direct, concise, and crypto-native. Always end with a 💡 Action: line telling the user the most important thing to do next.`,
  model,
});