import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
// Create a server
const server = http.createServer((req, res) => {
  if (
    req?.url?.match(
      /\/api\/v1\/[^/]+\/actions\/blueprints\/[^/]+(?:\/[^/]+)?\/graph/,
    ) &&
    req.method === "GET"
  ) {
    const filePath = path.join(__dirname, "graph.json");

    // Read the graph.json file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to load graph.json" }));
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(data);
    });
  } else {
    // Handle 404 for other routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Resource not found!" }));
  }
});

// Start the server on port 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
