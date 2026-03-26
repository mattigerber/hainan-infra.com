import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const imageExtensions = [".webp", ".avif", ".jpg", ".jpeg", ".png", ".gif"] as const;
const extensionPriority = new Map(imageExtensions.map((extension, index) => [extension, index]));

type TeamImageMap = Record<string, string>;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teamDir = path.join(process.cwd(), "public", "team");
    const entries = await readdir(teamDir, { withFileTypes: true });

    const bestByBaseName = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .reduce<Map<string, string>>((accumulator, fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        if (!extensionPriority.has(extension as (typeof imageExtensions)[number])) {
          return accumulator;
        }

        const baseName = path.basename(fileName, extension).toLowerCase();
        const currentFileName = accumulator.get(baseName);
        if (!currentFileName) {
          accumulator.set(baseName, fileName);
          return accumulator;
        }

        const currentExtension = path.extname(currentFileName).toLowerCase();
        const currentRank = extensionPriority.get(currentExtension as (typeof imageExtensions)[number]) ?? Number.MAX_SAFE_INTEGER;
        const nextRank = extensionPriority.get(extension as (typeof imageExtensions)[number]) ?? Number.MAX_SAFE_INTEGER;

        if (nextRank < currentRank) {
          accumulator.set(baseName, fileName);
        }

        return accumulator;
      }, new Map());

    const images: TeamImageMap = Object.fromEntries(
      Array.from(bestByBaseName.entries()).map(([baseName, fileName]) => [
        baseName,
        `/team/${encodeURIComponent(fileName)}`,
      ])
    );

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: {} });
  }
}