import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';

"use strict";
const rawURL = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434/v1";
const baseURL = rawURL.endsWith("/v1") ? rawURL : rawURL.replace(/\/api$/, "/v1").replace(/\/$/, "") + "/v1";
const openaiCompatible = createOpenAI({
  baseURL,
  apiKey: process.env.OPENAI_API_KEY || "ollama"
});
const model = openaiCompatible(
  process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:0.6b"
);
const cryptoDeskAgent = new Agent({
  name: "CryptoDesk",
  instructions: `You are CryptoDesk \u2014 a sharp, no-nonsense personal crypto intelligence agent. You help crypto-native users cut through market noise and stay on top of what matters. Be direct, concise, and crypto-native. Always end with a \u{1F4A1} Action: line telling the user the most important thing to do next.`,
  model
});

"use strict";
const mastra = new Mastra({
  agents: {
    cryptoDeskAgent
  }
});

export { mastra };
