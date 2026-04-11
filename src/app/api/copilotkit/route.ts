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
      model: process.env.MODEL_NAME || "qwen3:8b",
      openai: new (require("openai").default)({
        baseURL: process.env.OPENAI_API_URL || "https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/v1",
        apiKey: process.env.OPENAI_API_KEY || "nosana",
      }),
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};