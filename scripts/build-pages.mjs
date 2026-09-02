import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.resolve(root, process.env.BUILD_DIR || "dist");
const buildSha = process.env.BUILD_SHA || "LOCAL_UNBUILT";
const buildTime = process.env.BUILD_TIME || new Date().toISOString();
const buildBranch = process.env.BUILD_BRANCH || "local";

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const copyTree = (source, destination) => {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
};

for (const file of ["styles.css", "app.js"]) fs.copyFileSync(path.join(root, file), path.join(outDir, file));
copyTree(path.join(root, "src"), path.join(outDir, "src"));
let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index.replaceAll('data-build-sha="LOCAL_UNBUILT"', `data-build-sha="${buildSha}"`);
index = index.replaceAll('data-build-time="LOCAL"', `data-build-time="${buildTime}"`);
index = index.replaceAll('data-build-branch="feat/management-center-preprod-v7"', `data-build-branch="${buildBranch}"`);
fs.writeFileSync(path.join(outDir, "index.html"), index, "utf8");
fs.writeFileSync(path.join(outDir, "build-info.json"), JSON.stringify({ environment: "PREPROD LAB", buildSha, buildMarker: "jinji-v14r-plus-r4-desktop-v7-mobile-nav", buildTime, buildBranch }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ outDir, buildSha, buildTime, buildBranch }));
