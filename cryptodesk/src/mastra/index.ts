import { Mastra } from "@mastra/core";
import { cryptoDeskAgent } from "./agents/cryptodesk-agent";

export const mastra = new Mastra({
  agents: { cryptoDeskAgent },
});
