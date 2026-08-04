import { createServer } from "node:http";
import { handleRequest } from "./worker.js";

const port = Number(process.env.PORT || 8787);

createServer(async (incoming, outgoing) => {
  const chunks = [];
  for await (const chunk of incoming) chunks.push(chunk);

  const url = new URL(incoming.url || "/", `http://${incoming.headers.host || `localhost:${port}`}`);
  const request = new Request(url, {
    method: incoming.method,
    headers: incoming.headers,
    body: ["GET", "HEAD"].includes(incoming.method || "GET") ? undefined : Buffer.concat(chunks),
  });

  try {
    const response = await handleRequest(request, process.env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { "content-type": "application/json" });
    outgoing.end(JSON.stringify({ error: "Internal server error." }));
  }
}).listen(port, () => {
  console.log(`Personal Operating System available at http://localhost:${port}`);
});
