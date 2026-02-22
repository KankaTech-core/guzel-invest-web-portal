#!/usr/bin/env node

/**
 * Prisma Migration Baseline Script
 * 
 * On first deployment, marks all existing migrations as "already applied"
 * using `prisma migrate resolve`. This prevents P3005 errors when deploying
 * to a database that was previously managed with `prisma db push`.
 * 
 * Safe to run repeatedly — if migrations are already tracked, this is a no-op.
 */

import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const migrationsDir = join(projectRoot, 'prisma', 'migrations');
const schemaPath = join(projectRoot, 'prisma', 'schema.prisma');

// Find all migration folder names
const migrationNames = readdirSync(migrationsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

if (migrationNames.length === 0) {
    console.log('✅ No migrations found, skipping baseline.');
    process.exit(0);
}

console.log(`🔍 Checking baseline for ${migrationNames.length} migration(s)...`);

// We ONLY want to baseline the initial schema migration.
// Any subsequent migrations (like adding new project columns) must actually run!
const baselineMigrationName = '00000000000000_baseline';

if (!migrationNames.includes(baselineMigrationName)) {
    console.log(`✅ Baseline migration '${baselineMigrationName}' not found in folder, skipping.`);
} else {
    console.log(`🔍 Checking baseline specifically for '${baselineMigrationName}'...`);
    try {
        execSync(
            `npx prisma migrate resolve --applied "${baselineMigrationName}" --schema "${schemaPath}"`,
            { stdio: 'pipe', cwd: projectRoot }
        );
        console.log(`✅ Marked "${baselineMigrationName}" as applied.`);
    } catch (err) {
        const stderr = err.stderr?.toString() || '';
        if (stderr.includes('already') || stderr.includes('is already')) {
            console.log(`✅ "${baselineMigrationName}" is already tracked, skipping.`);
        } else {
            console.log(`⚠️  Could not resolve "${baselineMigrationName}": ${stderr.trim().split('\\n').pop()}`);
        }
    }
}

console.log('✅ Baseline check complete.');
