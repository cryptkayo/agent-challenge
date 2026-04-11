import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { mastra } from "../../../mastra";
import { NextRequest } from "next/server";
import { MastraClient } from "@mastra/client-js";

const runtime = new CopilotRuntime({
  agents: {
    cryptoDeskAgent: {
      name: "CryptoDesk",
      description: "Your personal crypto intelligence agent - research narratives, check your watchlist, draft threads, and get daily briefings.",
    },
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new MastraClient({
      mastra,
      agentId: "cryptoDeskAgent",
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
