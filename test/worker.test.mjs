import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "../worker.js";

test("health reports an unconfigured API key", async () => {
  const response = await handleRequest(new Request("https://example.test/api/health"), {});
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.configured, false);
});

test("AI route rejects a missing API key", async () => {
  const response = await handleRequest(
    new Request("https://example.test/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "What is next?" }),
    }),
    {}
  );
  assert.equal(response.status, 503);
});

test("AI route validates input", async () => {
  const response = await handleRequest(
    new Request("https://example.test/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "" }),
    }),
    { OPENAI_API_KEY: "test-key" }
  );
  assert.equal(response.status, 400);
});

test("AI route returns extracted response text", async () => {
  const mockFetch = async () =>
    new Response(
      JSON.stringify({
        id: "resp_test",
        output: [{ content: [{ type: "output_text", text: "Prioritize the permit filing." }] }],
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );

  const response = await handleRequest(
    new Request("https://example.test/api/ai", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "oai-authenticated-user-email": "owner@example.test",
      },
      body: JSON.stringify({ question: "What should I prioritize?" }),
    }),
    { OPENAI_API_KEY: "test-key", REQUIRE_AUTH: "true" },
    mockFetch
  );

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.answer, "Prioritize the permit filing.");
  assert.equal(data.response_id, "resp_test");
});
