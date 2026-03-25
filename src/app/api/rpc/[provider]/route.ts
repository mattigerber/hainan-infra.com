import { NextRequest, NextResponse } from "next/server";

type ProviderKey = "pocket" | "lava";

const providerEnvMap: Record<ProviderKey, string> = {
  pocket: "POCKET_RPC",
  lava: "LAVA_RPC",
};

const resolveProviderUrl = (provider: string): string | null => {
  if (provider !== "pocket" && provider !== "lava") {
    return null;
  }

  const envName = providerEnvMap[provider];
  const value = process.env[envName]?.trim() ?? "";
  return value.length > 0 ? value : null;
};

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const targetUrl = resolveProviderUrl(provider);

  if (!targetUrl) {
    return NextResponse.json({ error: "RPC provider is not configured." }, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON-RPC payload." }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseBody = await upstreamResponse.text();

    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: {
        "content-type": upstreamResponse.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to reach upstream RPC provider." }, { status: 502 });
  }
}
