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

for (const name of migrationNames) {
    try {
        execSync(
            `npx prisma migrate resolve --applied "${name}" --schema "${schemaPath}"`,
            { stdio: 'pipe', cwd: projectRoot }
        );
        console.log(`✅ Marked "${name}" as applied.`);
    } catch (err) {
        const stderr = err.stderr?.toString() || '';
        // "already applied" or "already recorded" errors are fine
        if (stderr.includes('already') || stderr.includes('is already')) {
            console.log(`✅ "${name}" is already tracked, skipping.`);
        } else {
            // Any other error — log but don't fail the build
            console.log(`⚠️  Could not resolve "${name}": ${stderr.trim().split('\n').pop()}`);
        }
    }
}

console.log('✅ Baseline check complete.');
