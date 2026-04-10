import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({
      model: "qwen3:0.6b",
      openai: new (require("openai").default)({
        baseURL: "http://127.0.0.1:11434/v1",
        apiKey: "ollama",
      }),
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};