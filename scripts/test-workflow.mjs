import os from "node:os";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const actionlintVersion = "v1.7.7";
const actionlintModule = `github.com/rhysd/actionlint/cmd/actionlint@${actionlintVersion}`;
const workflowFiles = [".github/workflows/ci.yml", ".github/workflows/pages.yml"];
const tempRoot = path.join(os.tmpdir(), "jinji-web-v14r-lab-actionlint");
const env = {
  ...process.env,
  GOPATH: path.join(tempRoot, "gopath"),
  GOCACHE: path.join(tempRoot, "gocache"),
};

mkdirSync(env.GOPATH, { recursive: true });
mkdirSync(env.GOCACHE, { recursive: true });

const result = spawnSync("go", ["run", actionlintModule, ...workflowFiles], {
  env,
  stdio: "inherit",
});

if (result.error) {
  console.error(`WORKFLOW_LINT_ERROR=${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`ACTIONLINT_PASS=${actionlintVersion}`);
