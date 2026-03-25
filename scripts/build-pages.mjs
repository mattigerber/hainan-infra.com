import { access, rename } from "node:fs/promises";
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

try {
  await run("node", ["scripts/generate-media-manifests.mjs"], process.env);
  await disableServerOnlyArtifacts();

  await run("npx", ["next", "build"], {
    ...process.env,
    GITHUB_PAGES: "true",
  });
} finally {
  await restoreServerOnlyArtifacts();
}
