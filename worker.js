/**
 * Cloudflare Worker: High-Availability Load Balancer (Refined)
 * 
 * Features:
 * 1. Weighted Round-Robin Load Balancing
 * 2. Automatic Failover & Health Detection
 * 3. Client IP Hashing (Session Stickiness)
 * 4. CORS Passthrough
 */

const BACKENDS = [ 
  { url: "https://thinkswipe-9ahs.onrender.com", name: "9ahs-render2", weight: 3 },
  { url: "https://thinkswipe-9mg2.onrender.com", name: "9mg2-render3", weight: 3 },
  { url: "https://thinkswipe-i5tn.onrender.com", name: "i5tn-render4", weight: 3 }, // Fixed leading space
  { url: "https://thinkswipe.onrender.com", name: "swipe-render1", weight: 1 },
];

const ALLOWED_ORIGINS = [
  "https://thinkswipe.vercel.app",
];

const FAILURE_TTL_MS = 30 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

const unhealthyUntil = new Map();

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Vary": "Origin",
  };
}

function markBackendFailure(name) {
  unhealthyUntil.set(name, Date.now() + FAILURE_TTL_MS);
}

function isBackendHealthy(backend) {
  const until = unhealthyUntil.get(backend.name);
  return !until || Date.now() > until;
}

function getWeightedHealthyBackends() {
  const healthy = BACKENDS.filter(isBackendHealthy);
  const source = healthy.length ? healthy : BACKENDS;

  const expanded = [];
  for (const backend of source) {
    for (let i = 0; i < backend.weight; i++) {
      expanded.push(backend);
    }
  }
  return expanded;
}

function pickStartIndex(request, length) {
  const key =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    crypto.randomUUID();

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function proxyToBackend(request, backend) {
  const incomingUrl = new URL(request.url);
  
  // Strip /api prefix if present for backend compatibility
  let pathname = incomingUrl.pathname;
  if (pathname.startsWith("/api")) {
    pathname = pathname.substring(4);
    if (!pathname.startsWith("/")) pathname = "/" + pathname;
  }
  
  const targetUrl = new URL(pathname + incomingUrl.search, backend.url);

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  // Authentication cleanup (if needed)
  if (incomingUrl.pathname === "/api/auth/login") {
    const auth = headers.get("authorization") || "";
    if (auth.startsWith("Basic ")) {
      headers.delete("authorization");
    }
  }

  headers.set("x-forwarded-proto", "https");
  headers.set("x-forwarded-host", incomingUrl.host);

  return fetchWithTimeout(
    targetUrl.toString(),
    {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.clone().body,
      redirect: "manual",
    },
    REQUEST_TIMEOUT_MS
  );
}

function shouldRetry(response) {
  return response.status >= 500 || response.status === 429;
}

export default {
  async fetch(request) {
    const origin = request.headers.get("origin") || ALLOWED_ORIGINS[0];

    // Handle OPTIONS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      });
    }

    const pool = getWeightedHealthyBackends();
    const startIndex = pickStartIndex(request, pool.length);
    let lastError = null;

    for (let i = 0; i < pool.length; i++) {
      const backend = pool[(startIndex + i) % pool.length];

      try {
        const response = await proxyToBackend(request, backend);

        // If backend fails, mark as unhealthy and retry with another
        if (shouldRetry(response)) {
          markBackendFailure(backend.name);
          lastError = `${backend.name} returned ${response.status}`;
          if (["GET", "HEAD"].includes(request.method)) continue; // Only retry idempotent requests
        }

        const out = new Response(response.body, response);
        // Apply CORS headers to the response
        const cors = getCorsHeaders(origin);
        Object.keys(cors).forEach(key => out.headers.set(key, cors[key]));
        
        out.headers.set("x-backend-used", backend.url);
        return out;

      } catch (error) {
        markBackendFailure(backend.name);
        lastError = `${backend.name} failed: ${error.message}`;
        if (["GET", "HEAD"].includes(request.method)) continue; 
      }
    }

    return new Response(
      JSON.stringify({
        message: "All backends unavailable",
        error: lastError,
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(origin),
        },
      }
    );
  },
};
