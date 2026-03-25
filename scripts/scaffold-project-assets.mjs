import fs from "node:fs";
import path from "node:path";

const frontendRoot = process.cwd();
const projectsPublicPath = path.join(frontendRoot, "public", "projects");
const catalogFilePath = path.join(frontendRoot, "src", "data", "projectCatalog.json");
const dryRun = process.argv.includes("--dry-run");
const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);
const videoExtensions = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);

const toTitleCase = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const filenameToTitle = (fileName) => {
  const rawName = path.basename(fileName, path.extname(fileName));
  const normalized = rawName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? toTitleCase(normalized) : "Project Image";
};

const ensureDirectory = (dirPath) => {
  if (dryRun) return;
  fs.mkdirSync(dirPath, { recursive: true });
};

const ensureKeepFile = (filePath) => {
  if (fs.existsSync(filePath)) return;
  if (dryRun) return;
  fs.writeFileSync(filePath, "", "utf8");
};

const isCatalogEntry = (value) => {
  if (!value || typeof value !== "object") return false;
  if (!value.project || typeof value.project !== "object") return false;
  return typeof value.project.id === "string";
};

if (!fs.existsSync(catalogFilePath)) {
  console.error("Could not find src/data/projectCatalog.json");
  process.exit(1);
}

const catalogData = JSON.parse(fs.readFileSync(catalogFilePath, "utf8"));
if (!Array.isArray(catalogData)) {
  console.error("src/data/projectCatalog.json must be an array.");
  process.exit(1);
}

if (!catalogData.every(isCatalogEntry)) {
  console.error("src/data/projectCatalog.json entries must include project.id");
  process.exit(1);
}

const projectIds = [
  ...new Set(
    catalogData
      .map((entry) => entry?.project?.id)
      .filter((id) => typeof id === "string"),
  ),
].sort();

if (projectIds.length === 0) {
  console.error("No project IDs were found in src/data/projectCatalog.json");
  process.exit(1);
}

ensureDirectory(projectsPublicPath);

let hasCatalogChanges = false;

for (const projectId of projectIds) {
  const catalogEntry = catalogData.find((entry) => entry.project.id === projectId);
  if (!catalogEntry) {
    continue;
  }

  const projectBasePath = path.join(projectsPublicPath, projectId);
  const imagesPath = path.join(projectBasePath, "images");
  const filesPath = path.join(projectBasePath, "files");
  const abiPath = path.join(projectBasePath, "abi");

  ensureDirectory(imagesPath);
  ensureDirectory(filesPath);
  ensureDirectory(abiPath);

  const imageKeepPath = path.join(imagesPath, ".gitkeep");
  const fileKeepPath = path.join(filesPath, ".gitkeep");
  const abiKeepPath = path.join(abiPath, ".gitkeep");

  ensureKeepFile(imageKeepPath);
  ensureKeepFile(fileKeepPath);
  ensureKeepFile(abiKeepPath);

  const mediaFiles = fs
    .readdirSync(imagesPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

  const imageFiles = mediaFiles.filter((fileName) =>
    imageExtensions.has(path.extname(fileName).toLowerCase()),
  );

  const localVideoFiles = mediaFiles.filter((fileName) =>
    videoExtensions.has(path.extname(fileName).toLowerCase()),
  );

  const imageGalleryItems = imageFiles.map((fileName) => ({
    kind: "image",
    title: filenameToTitle(fileName),
    src: `/projects/${projectId}/images/${encodeURIComponent(fileName)}`,
  }));

  const localVideoGalleryItems = localVideoFiles.map((fileName) => ({
    kind: "video",
    title: filenameToTitle(fileName),
    src: `/projects/${projectId}/images/${encodeURIComponent(fileName)}`,
  }));

  const nextGallery = [...localVideoGalleryItems, ...imageGalleryItems];
  const currentGallery = Array.isArray(catalogEntry.project.gallery)
    ? catalogEntry.project.gallery
    : [];

  if (JSON.stringify(currentGallery) !== JSON.stringify(nextGallery)) {
    catalogEntry.project.gallery = nextGallery;
    hasCatalogChanges = true;
  }
}

if (hasCatalogChanges && !dryRun) {
  fs.writeFileSync(catalogFilePath, `${JSON.stringify(catalogData, null, 2)}\n`, "utf8");
}

console.log(
  `${dryRun ? "Dry run complete for" : "Scaffolded asset folders and synced catalog galleries for"} ${projectIds.length} projects.`,
);
