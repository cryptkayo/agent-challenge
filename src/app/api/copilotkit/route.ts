import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

// Supports two deployment modes via environment variables:
// 1. Local development — uses Ollama (http://127.0.0.1:11434/v1) with qwen3:0.6b
// 2. Nosana deployment — uses Nosana hosted endpoint with qwen3:8b
// Switch between modes by setting OPENAI_API_URL, OPENAI_API_KEY, and MODEL_NAME in .env
const openaiClient = new OpenAI({
  baseURL: process.env.OPENAI_API_URL || "http://127.0.0.1:11434/v1",
  apiKey: process.env.OPENAI_API_KEY || "ollama",
});

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({
      openai: openaiClient,
      model: process.env.MODEL_NAME || "qwen3:0.6b",
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};