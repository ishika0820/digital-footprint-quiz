const encoder = new TextEncoder();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function encodeBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+")
    .replace(/_/g, "/");
  const padded = base64.padEnd(
    Math.ceil(base64.length / 4) * 4, "="
  );
  return Uint8Array.from(
    atob(padded),
    character => character.charCodeAt(0)
  );
}

async function getSigningKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function createSession(user, secret) {
  const payload = {
    uid: user.localId,
    email: user.email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  const body = encodeBase64Url(
    encoder.encode(JSON.stringify(payload))
  );

  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC", key, encoder.encode(body)
  );

  return body + "." +
    encodeBase64Url(new Uint8Array(signature));
}

async function verifySession(request, secret, domain) {
  const cookies = request.headers.get("Cookie") || "";
  const match = cookies.match(
    /(?:^|;\s*)quiz_session=([^;]+)/
  );

  if (!match) return false;

  const parts = match[1].split(".");
  if (parts.length !== 2) return false;

  try {
    const key = await getSigningKey(secret);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(parts[1]),
      encoder.encode(parts[0])
    );

    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(
        decodeBase64Url(parts[0])
      )
    );

    return (
      typeof payload.uid === "string" &&
      payload.uid.length > 0 &&
      typeof payload.email === "string" &&
      payload.email.endsWith("@" + domain) &&
      Number.isFinite(payload.exp) &&
      payload.exp > Date.now() / 1000
    );

  } catch {
    return false;
  }
}

async function verifyFirebaseUser(token, apiKey) {
  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
    encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: token })
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.users?.[0] || null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const domain = (env.ALLOWED_DOMAIN || "")
      .trim().toLowerCase().replace(/^@/, "");

    if (
      !env.FIREBASE_API_KEY ||
      !env.SESSION_SECRET ||
      !domain
    ) {
      return new Response(
        "Authentication is not configured.",
        { status: 503 }
      );
    }

    // Public endpoint for creating a session.
    if (path === "/api/session") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405
        });
      }

      if (
        request.headers.get("Origin") !== url.origin ||
        !request.headers.get("Content-Type")
          ?.startsWith("application/json")
      ) {
        return json({ error: "Invalid request" }, 403);
      }

      let body;
      try {
        if (
          Number(request.headers.get("Content-Length")) >
          16384
        ) {
          return json({ error: "Request too large" }, 413);
        }
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      if (
        typeof body?.token !== "string" ||
        body.token.length > 8192
      ) {
        return json({ error: "Invalid token" }, 400);
      }

      const user = await verifyFirebaseUser(
        body.token,
        env.FIREBASE_API_KEY
      );

      const email = user?.email?.toLowerCase();

      const googleProvider = user?.providerUserInfo?.some(
        provider => provider.providerId === "google.com"
      );

      if (
        !user?.localId ||
        !user.emailVerified ||
        !googleProvider ||
        !email?.endsWith("@" + domain) ||
        user.disabled
      ) {
        return json({ error: "Access denied" }, 403);
      }

      const session = await createSession(
        user, env.SESSION_SECRET
      );

      const response = json({ success: true });

      response.headers.set(
        "Set-Cookie",
        `quiz_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`
      );

      return response;
    }

    // Logout endpoint.
    if (path === "/api/logout") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405
        });
      }

      if (request.headers.get("Origin") !== url.origin) {
        return new Response("Forbidden", { status: 403 });
      }

      const response = json({ success: true });
      response.headers.set(
        "Set-Cookie",
        "quiz_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
      );
      return response;
    }

    // These files are intentionally public.
    const publicPaths = new Set([
      "/login.html",
      "/login",
      "/auth.js",
      "/style.css",
      "/favicon.ico"
    ]);

    if (publicPaths.has(path)) {
      return env.ASSETS.fetch(request);
    }

    // All other resources require a valid session.
    const authorized = await verifySession(
      request,
      env.SESSION_SECRET,
      domain
    );

    if (!authorized) {
      if (
        request.method === "GET" &&
        (path === "/" || path === "/index.html")
      ) {
        return Response.redirect(
          url.origin + "/login", 302
        );
      }

      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "Cache-Control": "no-store"
        }
      });
    }

    // Authorized visitors may access the quiz.
    const response = await env.ASSETS.fetch(request);

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "private, no-store");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};