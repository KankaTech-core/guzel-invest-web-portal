#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DANGEROUS_TOKEN = "I_UNDERSTAND_AND_ACCEPT_DATA_LOSS";
const REMOTE_TOKEN = "I_UNDERSTAND_REMOTE_DB_RISK";
const LOCAL_DATABASE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "postgres",
  "db",
  "guzel-postgres",
]);

function normalizeValue(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().toLowerCase();
}

export function isProductionEnvironment(env) {
  const flags = [env.NODE_ENV, env.APP_ENV, env.ENVIRONMENT, env.VERCEL_ENV];
  return flags.some((flag) => {
    const normalized = normalizeValue(flag);
    return normalized === "production" || normalized === "prod";
  });
}

export function extractDatabaseHost(databaseUrl) {
  if (typeof databaseUrl !== "string" || databaseUrl.trim() === "") {
    return null;
  }

  try {
    const parsed = new URL(databaseUrl);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function assertDestructiveDbCommandAllowed(env, commandName = "db:command") {
  if (isProductionEnvironment(env)) {
    throw new Error(
      `[${commandName}] blocked: destructive DB commands are never allowed in production-like environments.`
    );
  }

  const databaseHost = extractDatabaseHost(env.DATABASE_URL);
  if (!databaseHost) {
    throw new Error(
      `[${commandName}] blocked: DATABASE_URL is missing or invalid, refusing destructive command.`
    );
  }

  if (
    !LOCAL_DATABASE_HOSTS.has(databaseHost) &&
    env.ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS !== REMOTE_TOKEN
  ) {
    throw new Error(
      `[${commandName}] blocked: DATABASE_URL host "${databaseHost}" is remote. Set ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS=${REMOTE_TOKEN} only if intentional.`
    );
  }

  if (env.ALLOW_DESTRUCTIVE_DB_COMMANDS !== DANGEROUS_TOKEN) {
    throw new Error(
      `[${commandName}] blocked: set ALLOW_DESTRUCTIVE_DB_COMMANDS=${DANGEROUS_TOKEN} to confirm data-loss risk.`
    );
  }
}

function runCli() {
  const commandName = process.argv[2] || "db:command";
  try {
    assertDestructiveDbCommandAllowed(process.env, commandName);
    console.log(`[${commandName}] guard passed.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  runCli();
}

