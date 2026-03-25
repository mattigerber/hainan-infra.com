import { access, cp, mkdir, readdir, readFile, rename } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();

const targets = [
  {
    original: path.join(root, "src", "app", "api"),
    backup: path.join(root, "src", "app", "__api.pages-disabled"),
  },
  {
    original: path.join(root, "src", "proxy.ts"),
    backup: path.join(root, "src", "__proxy.pages-disabled.ts"),
  },
];

const moved = [];
const EXPORT_OUTPUT_DIR = path.join(root, "out");
const SUPPORTED_LOCALES = ["en", "zh", "ru", "ar"];

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const run = (command, args, env) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env,
      stdio: "inherit",
      shell: false,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command failed with exit code ${code ?? 1}: ${command} ${args.join(" ")}`,
        ),
      );
    });
  });

const disableServerOnlyArtifacts = async () => {
  for (const target of targets) {
    if (!(await exists(target.original))) {
      continue;
    }

    if (await exists(target.backup)) {
      throw new Error(`Backup path already exists: ${target.backup}`);
    }

    await rename(target.original, target.backup);
    moved.push(target);
  }
};

const restoreServerOnlyArtifacts = async () => {
  for (let index = moved.length - 1; index >= 0; index -= 1) {
    const target = moved[index];

    if (await exists(target.backup)) {
      await rename(target.backup, target.original);
    }
  }
};

const normalizeLegacyPrefix = (value) =>
  value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");

const getLegacyPrefixes = async () => {
  const prefixes = new Set();

  const envPrefixes = (process.env.PAGES_LEGACY_PREFIXES || "")
    .split(",")
    .map(normalizeLegacyPrefix)
    .filter(Boolean);

  for (const value of envPrefixes) {
    prefixes.add(value);
  }

  prefixes.add(normalizeLegacyPrefix(path.basename(root)));

  const cnamePath = path.join(root, "CNAME");
  if (await exists(cnamePath)) {
    const cnameValue = normalizeLegacyPrefix(await readFile(cnamePath, "utf8"));
    if (cnameValue) {
      prefixes.add(cnameValue);
    }
  }

  return [...prefixes].filter((prefix) => {
    if (!prefix) return false;
    if (prefix.includes("..")) return false;
    if (prefix.startsWith("_next")) return false;

    return true;
  });
};

const mirrorExportForLegacyPrefixes = async () => {
  if (!(await exists(EXPORT_OUTPUT_DIR))) {
    return;
  }

  const legacyPrefixes = await getLegacyPrefixes();
  if (legacyPrefixes.length === 0) {
    return;
  }

  const topLevelEntries = await readdir(EXPORT_OUTPUT_DIR, {
    withFileTypes: true,
  });

  for (const prefix of legacyPrefixes) {
    const prefixDir = path.join(EXPORT_OUTPUT_DIR, prefix);
    await mkdir(prefixDir, { recursive: true });

    for (const entry of topLevelEntries) {
      const entryName = entry.name;

      if (entryName === prefix) {
        continue;
      }

      if (legacyPrefixes.includes(entryName)) {
        continue;
      }

      if (
        entryName === "_next" ||
        SUPPORTED_LOCALES.includes(entryName) ||
        entryName.endsWith(".html")
      ) {
        const sourcePath = path.join(EXPORT_OUTPUT_DIR, entryName);
        const destinationPath = path.join(prefixDir, entryName);
        await cp(sourcePath, destinationPath, { recursive: true, force: true });
      }
    }
  }
};

try {
  await run("node", ["scripts/generate-media-manifests.mjs"], process.env);
  await disableServerOnlyArtifacts();

  await run("npx", ["next", "build", "--webpack"], {
    ...process.env,
    GITHUB_PAGES: "true",
  });

  await mirrorExportForLegacyPrefixes();
} finally {
  await restoreServerOnlyArtifacts();
}
