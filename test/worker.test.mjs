import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { handleRequest } from "../worker.js";

test("dashboard is publicly accessible without secrets", async () => {
  const response = await handleRequest(new Request("https://example.test/"), {});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Property Management Command Center/);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("static public mirror requires no password or account", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /Public link active/);
  assert.match(html, /No password/);
  assert.doesNotMatch(html, /type="password"/);
  assert.doesNotMatch(html, /action="\/auth\/login"/);
});

test("health reports public access and disabled AI by default", async () => {
  const response = await handleRequest(new Request("https://example.test/api/health"), {});
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.public_access, true);
  assert.equal(data.password_protected, false);
  assert.equal(data.ai_enabled, false);
  assert.equal(data.configured, false);
});

test("legacy login routes redirect to the public dashboard", async () => {
  const response = await handleRequest(new Request("https://example.test/login"), {});
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/");
});

test("public AI route is disabled by default even when a key exists", async () => {
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "What is next?" }),
  }), { OPENAI_API_KEY: "test-key" });
  assert.equal(response.status, 403);
});

test("enabled AI route requires an API key", async () => {
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "What is next?" }),
  }), { PUBLIC_AI_ENABLED: "true" });
  assert.equal(response.status, 503);
});

test("enabled AI route validates input", async () => {
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "" }),
  }), { PUBLIC_AI_ENABLED: "true", OPENAI_API_KEY: "test-key" });
  assert.equal(response.status, 400);
});

test("enabled AI route returns extracted response text", async () => {
  const mockFetch = async () => new Response(JSON.stringify({
    id: "resp_test",
    output: [{ content: [{ type: "output_text", text: "Prioritize the permit filing." }] }],
  }), { status: 200, headers: { "content-type": "application/json" } });
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "What should I prioritize?" }),
  }), { PUBLIC_AI_ENABLED: "true", OPENAI_API_KEY: "test-key" }, mockFetch);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.answer, "Prioritize the permit filing.");
  assert.equal(data.response_id, "resp_test");
});
