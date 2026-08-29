type ProxyEnv = {
  API_ORIGIN?: string;
};

type PagesContext = {
  request: Request;
  env: ProxyEnv;
  params: Record<string, string | undefined>;
};

export async function proxyToApi(context: PagesContext): Promise<Response> {
  const origin = context.env.API_ORIGIN?.replace(/\/+$/, "");
  if (!origin) {
    return new Response("Cloudflare Pages API_ORIGIN is not configured.", { status: 500 });
  }

  const incoming = new URL(context.request.url);
  const upstream = new URL(`${origin}${incoming.pathname}${incoming.search}`);
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init: RequestInit = {
    method: context.request.method,
    headers,
    redirect: "manual",
  };

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    init.body = await context.request.arrayBuffer();
  }

  const response = await fetch(upstream, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
