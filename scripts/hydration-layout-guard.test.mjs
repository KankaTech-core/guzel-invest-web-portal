import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const projectRoot = process.cwd();

const layoutFiles = [
  'src/app/(localized)/[locale]/layout.tsx',
  'src/app/(non-localized)/layout.tsx',
];

for (const file of layoutFiles) {
  test(`${file} suppresses extension-induced hydration mismatch on body`, async () => {
    const source = await readFile(path.join(projectRoot, file), 'utf8');
    assert.match(source, /<body[^>]*suppressHydrationWarning/, 'Expected <body> to include suppressHydrationWarning');
    assert.match(source, /<body[^>]*className=\{`\$\{outfit\.variable\}/, 'Expected body className to include ${outfit.variable}');
  });
}
