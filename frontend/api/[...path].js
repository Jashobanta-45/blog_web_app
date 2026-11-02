export const config = {
  api: {
    bodyParser: false
  }
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]);

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_INTERNAL_URL;

  if (!backendUrl) {
    return res.status(500).json({
      success: false,
      message: "Backend service binding is not configured"
    });
  }

  try {
    const targetUrl = new URL(req.url, backendUrl);
    const headers = new Headers();

    for (const [name, value] of Object.entries(req.headers)) {
      const lowerName = name.toLowerCase();

      if (
        value !== undefined &&
        lowerName !== "host" &&
        lowerName !== "content-length" &&
        !HOP_BY_HOP_HEADERS.has(lowerName)
      ) {
        headers.set(
          name,
          Array.isArray(value) ? value.join(", ") : value
        );
      }
    }

    const hasBody = !["GET", "HEAD"].includes(req.method);

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      ...(hasBody ? { duplex: "half" } : {}),
      redirect: "manual"
    });

    res.status(upstream.status);

    for (const [name, value] of upstream.headers.entries()) {
      const lowerName = name.toLowerCase();

      if (
        !HOP_BY_HOP_HEADERS.has(lowerName) &&
        lowerName !== "content-length" &&
        lowerName !== "content-encoding"
      ) {
        res.setHeader(name, value);
      }
    }

    const cookies = upstream.headers.getSetCookie?.();
    if (cookies?.length) {
      res.setHeader("set-cookie", cookies);
    }

    if (req.method === "HEAD" || [204, 304].includes(upstream.status)) {
      return res.end();
    }

    const responseBody = Buffer.from(await upstream.arrayBuffer());
    return res.end(responseBody);
  } catch (error) {
    console.error("Internal backend proxy failed:", error);

    return res.status(502).json({
      success: false,
      message: "Backend service is temporarily unavailable"
    });
  }
}
