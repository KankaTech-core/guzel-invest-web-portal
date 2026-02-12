/**
 * Güzel Invest - Cross-platform Dev Startup Script
 * Starts Docker services (PostgreSQL & MinIO) and Next.js dev server.
 * Works on Windows, macOS, and Linux.
 *
 * Usage: node scripts/start-dev.js
 */

const { execSync, spawn } = require("child_process");
const net = require("net");

const PORT = 3000;

function log(icon, msg) {
  console.log(`${icon}  ${msg}`);
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

async function killPort(port) {
  try {
    if (process.platform === "win32") {
      const result = execSync(
        `netstat -ano | findstr :${port} | findstr LISTENING`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      );
      const lines = result.trim().split("\n");
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0") pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          log("✅", `Killed process ${pid} on port ${port}`);
        } catch {}
      }
    } else {
      execSync(`lsof -ti :${port} | xargs kill -9 2>/dev/null || true`, {
        stdio: "ignore",
      });
      log("✅", `Killed process on port ${port}`);
    }
  } catch {
    // No process found, that's fine
  }
}

async function main() {
  console.log("");
  log("🚀", "Starting Güzel Invest Development Environment...");
  console.log("");

  // 1. Start Docker containers
  log("📦", "Starting Docker services (PostgreSQL & MinIO)...");
  try {
    execSync("docker-compose up -d", { stdio: "inherit", cwd: process.cwd() });
    log("✅", "Docker services started");
  } catch (err) {
    log("❌", "Failed to start Docker. Is Docker Desktop running?");
    process.exit(1);
  }

  console.log("");

  // 2. Check port
  const portBusy = await isPortInUse(PORT);
  if (portBusy) {
    log("⚠️ ", `Port ${PORT} is in use. Killing existing process...`);
    await killPort(PORT);
    // Small delay to let the port free up
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 3. Start Next.js
  log("💻", "Starting Next.js dev server...");
  console.log("");

  const nextDev = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "dev"],
    {
      stdio: "inherit",
      cwd: process.cwd(),
      shell: true,
    }
  );

  nextDev.on("close", (code) => {
    process.exit(code ?? 0);
  });

  // Forward termination signals
  process.on("SIGINT", () => nextDev.kill("SIGINT"));
  process.on("SIGTERM", () => nextDev.kill("SIGTERM"));
}

main();
