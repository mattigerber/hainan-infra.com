import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const videoExtensions = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const heroDir = path.join(process.cwd(), "public", "hero");
    const entries = await readdir(heroDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const imageFiles = files.filter((name) => imageExtensions.has(path.extname(name).toLowerCase()));
    const coverFile =
      imageFiles.find((name) => /^cover\./i.test(name)) ??
      imageFiles[0] ??
      null;

    const videoFiles = files.filter((name) => videoExtensions.has(path.extname(name).toLowerCase()));
    const videoFile =
      videoFiles.find((name) => /^video\./i.test(name)) ??
      videoFiles[0] ??
      null;

    return NextResponse.json({
      coverImageSrc: coverFile ? `/hero/${encodeURIComponent(coverFile)}` : null,
      videoSrc: videoFile ? `/hero/${encodeURIComponent(videoFile)}` : null,
    });
  } catch {
    return NextResponse.json({
      coverImageSrc: null,
      videoSrc: null,
    });
  }
}
