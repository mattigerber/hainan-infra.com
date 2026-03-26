import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);
const videoExtensions = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);

const byNaturalName = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const getFilesInDir = async (dirPath) => {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort(byNaturalName);
  } catch {
    return [];
  }
};

const writeJson = async (filePath, payload) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
};

const buildHeroManifest = async () => {
  const heroDir = path.join(PUBLIC_DIR, "hero");
  const files = await getFilesInDir(heroDir);

  const imageFiles = files.filter((name) =>
    imageExtensions.has(path.extname(name).toLowerCase()),
  );
  const videoFiles = files.filter((name) =>
    videoExtensions.has(path.extname(name).toLowerCase()),
  );

  const coverFile =
    imageFiles.find((name) => /^cover\./i.test(name)) ?? imageFiles[0] ?? null;
  const videoFile =
    videoFiles.find((name) => /^video\./i.test(name)) ?? videoFiles[0] ?? null;

  const payload = {
    coverImageSrc: coverFile ? `/hero/${encodeURIComponent(coverFile)}` : null,
    videoSrc: videoFile ? `/hero/${encodeURIComponent(videoFile)}` : null,
  };

  await writeJson(path.join(PUBLIC_DIR, "hero", "media.json"), payload);
};

const buildPartnershipmakerManifest = async () => {
  const imagesDir = path.join(PUBLIC_DIR, "partnershipmaker", "images");
  const files = await getFilesInDir(imagesDir);

  const images = files
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .map((name) => `/partnershipmaker/images/${encodeURIComponent(name)}`);

  await writeJson(
    path.join(PUBLIC_DIR, "partnershipmaker", "images", "index.json"),
    {
      images,
    },
  );
};

const buildTeamManifest = async () => {
  const teamDir = path.join(PUBLIC_DIR, "team");
  const files = await getFilesInDir(teamDir);

  const extensionPriority = [".webp", ".avif", ".jpg", ".jpeg", ".png", ".gif"];
  const extensionRanks = new Map(
    extensionPriority.map((extension, index) => [extension, index]),
  );

  const bestByBaseName = files
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .reduce((accumulator, fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      const baseName = path.basename(fileName, extension).toLowerCase();
      const currentFileName = accumulator.get(baseName);

      if (!currentFileName) {
        accumulator.set(baseName, fileName);
        return accumulator;
      }

      const currentExtension = path.extname(currentFileName).toLowerCase();
      const currentRank =
        extensionRanks.get(currentExtension) ?? Number.MAX_SAFE_INTEGER;
      const nextRank = extensionRanks.get(extension) ?? Number.MAX_SAFE_INTEGER;

      if (nextRank < currentRank) {
        accumulator.set(baseName, fileName);
      }

      return accumulator;
    }, new Map());

  const images = Object.fromEntries(
    Array.from(bestByBaseName.entries()).map(([baseName, fileName]) => [
      baseName,
      `/team/${encodeURIComponent(fileName)}`,
    ]),
  );

  await writeJson(path.join(PUBLIC_DIR, "team", "index.json"), { images });
};

await Promise.all([
  buildHeroManifest(),
  buildPartnershipmakerManifest(),
  buildTeamManifest(),
]);
