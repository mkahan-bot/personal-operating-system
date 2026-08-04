const DEFAULT_MODEL = "gpt-5";
const MAX_QUESTION_LENGTH = 4_000;
const MAX_CONTEXT_LENGTH = 12_000;

const SYSTEM_INSTRUCTIONS = `You are the AI operating advisor inside a private Personal Operating System dashboard.
Use only the information supplied in the request. Do not claim you changed records, sent messages, or completed external actions.
Give a decision-useful answer with these sections when applicable: Answer, Priorities, Risks or gaps, and Next actions.
Be precise, concise, and candid about missing information.`;

const SITE_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#101a2b">
<title>Personal Operating System</title>
<style>
:root{color-scheme:light;--ink:#162034;--muted:#667085;--navy:#101a2b;--paper:#f4f6f8;--card:#fff;--line:#dfe4ea;--green:#18836f;--gold:#c99335;--red:#b8424a}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.shell{min-height:100vh;display:grid;grid-template-columns:240px minmax(0,1fr)}aside{padding:28px 20px;background:linear-gradient(180deg,var(--navy),#162945);color:#fff}
.brand{font-weight:800;font-size:18px}.brand small{display:block;margin-top:4px;color:#aab6c6;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
nav{display:grid;gap:8px;margin-top:34px}nav a{padding:11px 12px;border-radius:10px;color:#b9c5d3;text-decoration:none}nav a.active{color:#fff;background:#ffffff18;box-shadow:inset 3px 0 var(--gold)}
.security{margin-top:38px;padding:14px;border:1px solid #ffffff25;border-radius:12px;color:#b9c5d3;font-size:11px}
main{padding:30px 36px 60px}.top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.eyebrow{color:var(--green);font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}
h1{margin:3px 0 4px;font-size:34px;letter-spacing:-.04em}.sub{margin:0;color:var(--muted)}
.status{display:inline-flex;gap:8px;align-items:center;padding:9px 12px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:12px;font-weight:700}.dot{width:8px;height:8px;border-radius:50%;background:#9aa4b2}.status.ok .dot{background:var(--green)}.status.bad .dot{background:var(--red)}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px}.metric,.panel{border:1px solid var(--line);border-radius:17px;background:var(--card);box-shadow:0 10px 28px #13233c10}
.metric{padding:18px}.metric span{display:block;color:var(--muted);font-size:11px;font-weight:750;text-transform:uppercase;letter-spacing:.06em}.metric strong{display:block;margin-top:10px;font-size:28px}
.layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr);gap:18px;margin-top:18px}.panel{padding:22px}.panel h2{margin:0;font-size:18px}.panel .help{margin:5px 0 18px;color:var(--muted);font-size:12px}
textarea{width:100%;min-height:125px;padding:13px;border:1px solid var(--line);border-radius:12px;resize:vertical;font:inherit;outline:none}textarea:focus{border-color:var(--green);box-shadow:0 0 0 3px #18836f18}
.row{display:flex;gap:10px;align-items:center;margin-top:12px}.button{border:0;border-radius:10px;padding:11px 15px;background:var(--navy);color:#fff;font-weight:800;cursor:pointer}.button:disabled{opacity:.55;cursor:wait}
.answer{min-height:210px;margin-top:18px;padding:16px;border-radius:13px;background:#f8fafb;border:1px solid var(--line);white-space:pre-wrap}.answer.empty{color:var(--muted)}
.list{display:grid;gap:11px}.item{padding:13px;border:1px solid var(--line);border-radius:12px}.item strong{display:block;font-size:13px}.item small{color:var(--muted)}
.note{margin-top:16px;padding:13px;border-radius:12px;background:#edf8f5;color:#225f55;font-size:11px}
@media(max-width:900px){.shell{display:block}aside{display:none}main{padding:22px 16px 40px}.grid{grid-template-columns:repeat(2,1fr)}.layout{grid-template-columns:1fr}.top{display:block}.status{margin-top:14px}}
@media(max-width:500px){.grid{grid-template-columns:1fr}h1{font-size:28px}}
</style>
</head>
<body>
<div class="shell">
<aside><div class="brand">Personal OS<small>Operations command center</small></div><nav><a class="active" href="#">Command Center</a><a href="#">Projects</a><a href="#">Tasks</a><a href="#">Weekly Review</a></nav><div class="security">AI requests are sent to a server-side route. The OpenAI API key is never delivered to the browser.</div></aside>
<main>
<div class="top"><div><div class="eyebrow">Private operating dashboard</div><h1>Personal Operating System</h1><p class="sub">Turn current priorities and dashboard context into concrete decisions and next actions.</p></div><div class="status" id="apiStatus"><span class="dot"></span><span>Checking API</span></div></div>
<div class="grid">
<div class="metric"><span>Current focus</span><strong>3</strong></div>
<div class="metric"><span>Decisions needed</span><strong>2</strong></div>
<div class="metric"><span>Waiting on others</span><strong>1</strong></div>
<div class="metric"><span>Family blocks</span><strong>2</strong></div>
</div>
<div class="layout">
<section class="panel"><h2>Ask the operating advisor</h2><p class="help">Ask for prioritization, a decision memo, risk review, delegation plan, or next-action sequence.</p>
<form id="aiForm"><textarea id="question" maxlength="4000" required placeholder="Example: What are the three highest-leverage actions today, and what should I delegate?"></textarea><div class="row"><button class="button" id="askButton" type="submit">Analyze</button><span class="help" id="requestState"></span></div></form>
<div class="answer empty" id="answer">The response will appear here.</div></section>
<section class="panel"><h2>Request patterns</h2><p class="help">The advisor works best with concrete facts and desired outcomes.</p><div class="list">
<div class="item"><strong>Prioritize</strong><small>Rank work by urgency, leverage, dependency, and risk.</small></div>
<div class="item"><strong>Decide</strong><small>Compare options and identify the recommended path.</small></div>
<div class="item"><strong>Delegate</strong><small>Convert an outcome into an assignment with scope and deadline.</small></div>
<div class="item"><strong>Review risk</strong><small>Surface gaps, contradictions, and missing controls.</small></div>
</div><div class="note">The AI endpoint does not automatically change dashboard records or send communications.</div></section>
</div>
</main>
</div>
<script>
const statusEl=document.getElementById("apiStatus");
const answerEl=document.getElementById("answer");
const form=document.getElementById("aiForm");
const button=document.getElementById("askButton");
const state=document.getElementById("requestState");

async function checkHealth(){
  try{
    const response=await fetch("/api/health",{headers:{"accept":"application/json"}});
    const data=await response.json();
    if(response.ok&&data.configured){
      statusEl.className="status ok";
      statusEl.lastElementChild.textContent="API ready";
    }else{
      statusEl.className="status bad";
      statusEl.lastElementChild.textContent="API key missing";
    }
  }catch{
    statusEl.className="status bad";
    statusEl.lastElementChild.textContent="API unavailable";
  }
}

form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  const question=document.getElementById("question").value.trim();
  if(!question)return;
  button.disabled=true;
  state.textContent="Analyzing…";
  answerEl.className="answer";
  answerEl.textContent="Working…";
  try{
    const response=await fetch("/api/ai",{method:"POST",headers:{"content-type":"application/json","accept":"application/json"},body:JSON.stringify({question})});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||"The request failed.");
    answerEl.textContent=data.answer;
  }catch(error){
    answerEl.textContent=error.message||"The request failed.";
  }finally{
    button.disabled=false;
    state.textContent="";
  }
});
checkHealth();
</script>
</body>
</html>`;

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw Object.assign(new Error("Content-Type must be application/json."), { status: 415 });
  }
  try {
    return await request.json();
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if ((content?.type === "output_text" || content?.type === "text") && typeof content?.text === "string") {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

async function safetyIdentifier(request) {
  const raw =
    request.headers.get("oai-authenticated-user-email") ||
    request.headers.get("cf-access-authenticated-user-email") ||
    request.headers.get("x-user-email") ||
    "private-site-user";

  const bytes = new TextEncoder().encode(raw.toLowerCase().trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const compact = [...new Uint8Array(digest)]
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `pos_${compact}`;
}

function hasAuthenticatedUser(request) {
  return Boolean(
    request.headers.get("oai-authenticated-user-email") ||
    request.headers.get("cf-access-authenticated-user-email") ||
    request.headers.get("x-user-email")
  );
}

async function handleAi(request, env, fetchImpl) {
  if (!env?.OPENAI_API_KEY) {
    return jsonResponse({ error: "The server is not configured with OPENAI_API_KEY." }, 503);
  }

  const requireAuth = String(env.REQUIRE_AUTH || "false").toLowerCase() === "true";
  if (requireAuth && !hasAuthenticatedUser(request)) {
    return jsonResponse({ error: "Sign-in is required to use the AI advisor." }, 401);
  }

  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    return jsonResponse({ error: error.message }, error.status || 400);
  }

  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const context = typeof body?.context === "string" ? body.context.trim() : "";

  if (!question) {
    return jsonResponse({ error: "A question is required." }, 400);
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonResponse({ error: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.` }, 400);
  }
  if (context.length > MAX_CONTEXT_LENGTH) {
    return jsonResponse({ error: `Context must be ${MAX_CONTEXT_LENGTH} characters or fewer.` }, 400);
  }

  const input = context
    ? `Dashboard context:\n${context}\n\nUser request:\n${question}`
    : question;

  const upstream = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: SYSTEM_INSTRUCTIONS,
      input,
      max_output_tokens: 900,
      store: false,
      safety_identifier: await safetyIdentifier(request),
    }),
  });

  let payload;
  try {
    payload = await upstream.json();
  } catch {
    payload = null;
  }

  if (!upstream.ok) {
    const upstreamMessage = payload?.error?.message;
    console.error("OpenAI API error", upstream.status, upstreamMessage || "Unknown error");
    return jsonResponse(
      {
        error:
          upstream.status === 401
            ? "The configured OpenAI API key was rejected."
            : upstream.status === 429
              ? "The OpenAI API rate or spending limit was reached."
              : "The AI service could not complete the request.",
      },
      upstream.status === 429 ? 429 : 502
    );
  }

  const answer = extractOutputText(payload);
  if (!answer) {
    return jsonResponse({ error: "The AI service returned an empty response." }, 502);
  }

  return jsonResponse({
    answer,
    model: env.OPENAI_MODEL || DEFAULT_MODEL,
    response_id: payload?.id || null,
  });
}

export async function handleRequest(request, env = {}, fetchImpl = fetch) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/") {
    return htmlResponse(SITE_HTML);
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    return jsonResponse({
      ok: true,
      configured: Boolean(env.OPENAI_API_KEY),
      model: env.OPENAI_MODEL || DEFAULT_MODEL,
      auth_required: String(env.REQUIRE_AUTH || "false").toLowerCase() === "true",
    });
  }

  if (request.method === "POST" && url.pathname === "/api/ai") {
    return handleAi(request, env, fetchImpl);
  }

  if (url.pathname.startsWith("/api/")) {
    return jsonResponse({ error: "Not found." }, 404);
  }

  return new Response("Not found.", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
