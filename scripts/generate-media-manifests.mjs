import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
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

  const imageFiles = files.filter((name) => imageExtensions.has(path.extname(name).toLowerCase()));
  const videoFiles = files.filter((name) => videoExtensions.has(path.extname(name).toLowerCase()));

  const coverFile = imageFiles.find((name) => /^cover\./i.test(name)) ?? imageFiles[0] ?? null;
  const videoFile = videoFiles.find((name) => /^video\./i.test(name)) ?? videoFiles[0] ?? null;

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

  await writeJson(path.join(PUBLIC_DIR, "partnershipmaker", "images", "index.json"), {
    images,
  });
};

await Promise.all([buildHeroManifest(), buildPartnershipmakerManifest()]);
