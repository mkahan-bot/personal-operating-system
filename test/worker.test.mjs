import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "../worker.js";

const env = {
  SITE_ACCESS_PASSWORD: "test-password",
  SITE_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
};

async function loginCookie(password = env.SITE_ACCESS_PASSWORD) {
  const response = await handleRequest(new Request("https://example.test/auth/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password }),
  }), env);
  return { response, cookie: response.headers.get("set-cookie")?.split(";")[0] || "" };
}

test("site fails closed when access secrets are missing", async () => {
  const response = await handleRequest(new Request("https://example.test/"), {});
  assert.equal(response.status, 503);
});

test("unauthenticated page requests redirect to login", async () => {
  const response = await handleRequest(new Request("https://example.test/"), env);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/login");
});

test("unauthenticated API requests return 401", async () => {
  const response = await handleRequest(new Request("https://example.test/api/health"), env);
  assert.equal(response.status, 401);
});

test("incorrect password is rejected", async () => {
  const { response } = await loginCookie("wrong-password");
  assert.equal(response.status, 401);
  assert.equal(response.headers.has("set-cookie"), false);
});

test("correct password creates a secure session", async () => {
  const { response, cookie } = await loginCookie();
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /Secure/);
  assert.ok(cookie.startsWith("pcc_session="));
});

test("authenticated health reports an unconfigured API key", async () => {
  const { cookie } = await loginCookie();
  const response = await handleRequest(new Request("https://example.test/api/health", { headers: { cookie } }), env);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.configured, false);
  assert.equal(data.password_protected, true);
});

test("authenticated AI route validates input", async () => {
  const { cookie } = await loginCookie();
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ question: "" }),
  }), { ...env, OPENAI_API_KEY: "test-key" });
  assert.equal(response.status, 400);
});

test("authenticated AI route returns extracted response text", async () => {
  const { cookie } = await loginCookie();
  const mockFetch = async () => new Response(JSON.stringify({ id: "resp_test", output: [{ content: [{ type: "output_text", text: "Prioritize the permit filing." }] }] }), { status: 200, headers: { "content-type": "application/json" } });
  const response = await handleRequest(new Request("https://example.test/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ question: "What should I prioritize?" }),
  }), { ...env, OPENAI_API_KEY: "test-key" }, mockFetch);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.answer, "Prioritize the permit filing.");
  assert.equal(data.response_id, "resp_test");
});
