const { createServer } = require("node:http");
const next = require("next");
const { loadEnvConfig } = require("@next/env");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);

loadEnvConfig(process.cwd());

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, hostname, () => {
      console.log(
        "Server listening on http://" +
          hostname +
          ":" +
          port +
          " (" +
          (dev ? "dev" : "prod") +
          ")",
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
