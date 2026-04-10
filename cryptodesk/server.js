const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { spawn } = require("child_process");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Start Mastra agent server on port 4111
  if (!dev) {
    const mastraProcess = spawn(
      "node",
      ["node_modules/.bin/mastra", "dev", "--dir", "src/mastra", "--port", "4111"],
      {
        stdio: "inherit",
        env: { ...process.env },
      }
    );

    mastraProcess.on("error", (err) => {
      console.error("Failed to start Mastra agent server:", err);
    });

    process.on("exit", () => mastraProcess.kill());
  }

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`\n🚀 CryptoDesk running at http://${hostname}:${port}`);
      console.log(`🤖 Agent: Mastra on port 4111`);
      console.log(`⚡ Network: Nosana Decentralized Compute\n`);
    });
});
