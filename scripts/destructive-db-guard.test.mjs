import assert from "node:assert/strict";
import test from "node:test";

import {
  assertDestructiveDbCommandAllowed,
  extractDatabaseHost,
  isProductionEnvironment,
} from "./destructive-db-guard.mjs";

const DANGEROUS_TOKEN = "I_UNDERSTAND_AND_ACCEPT_DATA_LOSS";
const REMOTE_TOKEN = "I_UNDERSTAND_REMOTE_DB_RISK";

test("isProductionEnvironment returns true for production-like values", () => {
  assert.equal(isProductionEnvironment({ NODE_ENV: "production" }), true);
  assert.equal(isProductionEnvironment({ APP_ENV: "prod" }), true);
  assert.equal(isProductionEnvironment({ VERCEL_ENV: "production" }), true);
  assert.equal(isProductionEnvironment({ NODE_ENV: "development" }), false);
});

test("extractDatabaseHost parses host correctly", () => {
  assert.equal(
    extractDatabaseHost("postgres://postgres:postgres@localhost:5432/app_db"),
    "localhost"
  );
  assert.equal(
    extractDatabaseHost("postgres://postgres:postgres@guzel-postgres:5432/app_db"),
    "guzel-postgres"
  );
});

test("assertDestructiveDbCommandAllowed blocks production regardless of tokens", () => {
  assert.throws(
    () =>
      assertDestructiveDbCommandAllowed(
        {
          NODE_ENV: "production",
          DATABASE_URL: "postgres://postgres:postgres@localhost:5432/app_db",
          ALLOW_DESTRUCTIVE_DB_COMMANDS: DANGEROUS_TOKEN,
        },
        "db:reset"
      ),
    /production/i
  );
});

test("assertDestructiveDbCommandAllowed requires explicit destructive token", () => {
  assert.throws(
    () =>
      assertDestructiveDbCommandAllowed(
        {
          NODE_ENV: "development",
          DATABASE_URL: "postgres://postgres:postgres@localhost:5432/app_db",
        },
        "db:reset"
      ),
    /ALLOW_DESTRUCTIVE_DB_COMMANDS/
  );
});

test("assertDestructiveDbCommandAllowed blocks remote hosts without remote token", () => {
  assert.throws(
    () =>
      assertDestructiveDbCommandAllowed(
        {
          NODE_ENV: "development",
          DATABASE_URL: "postgres://postgres:postgres@prod-db.internal:5432/app_db",
          ALLOW_DESTRUCTIVE_DB_COMMANDS: DANGEROUS_TOKEN,
        },
        "db:reset"
      ),
    /ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS/
  );
});

test("assertDestructiveDbCommandAllowed allows local host with required token", () => {
  assert.doesNotThrow(() =>
    assertDestructiveDbCommandAllowed(
      {
        NODE_ENV: "development",
        DATABASE_URL: "postgres://postgres:postgres@localhost:5432/app_db",
        ALLOW_DESTRUCTIVE_DB_COMMANDS: DANGEROUS_TOKEN,
      },
      "db:reset"
    )
  );
});

test("assertDestructiveDbCommandAllowed allows remote host with both tokens", () => {
  assert.doesNotThrow(() =>
    assertDestructiveDbCommandAllowed(
      {
        NODE_ENV: "development",
        DATABASE_URL: "postgres://postgres:postgres@staging-db.internal:5432/app_db",
        ALLOW_DESTRUCTIVE_DB_COMMANDS: DANGEROUS_TOKEN,
        ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS: REMOTE_TOKEN,
      },
      "db:reset"
    )
  );
});
