import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "partnershipmaker", "images");
    const entries = await readdir(imagesDir, { withFileTypes: true });

    const images = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((name) => `/partnershipmaker/images/${encodeURIComponent(name)}`);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
