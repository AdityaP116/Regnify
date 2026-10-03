// One-shot generator.
//
// The frontend already ships a deterministic seed corpus (frontend/src/data/seed.ts)
// that mirrors the reference designs exactly. Rather than hand-transcribing those
// ~700 lines of regulatory content into Python (which would drift immediately),
// we bundle the module with esbuild and snapshot it to JSON.
//
// The generated JSON is committed, so the backend is self-contained at runtime.
// Re-run this only when the frontend corpus changes:
//
//     node backend/scripts/export_seed.mjs
//
// esbuild is borrowed from frontend/node_modules (Vite already depends on it),
// which is why we resolve it through the frontend package root.

import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const frontendRoot = resolve(repoRoot, 'frontend');
const seedEntry = resolve(frontendRoot, 'src', 'data', 'seed.ts');
const bundlePath = resolve(here, '.seed.bundle.mjs');
const outFile = resolve(repoRoot, 'backend', 'app', 'data', 'seed_corpus.json');

const require = createRequire(resolve(frontendRoot, 'package.json'));
const { build } = require('esbuild');

const COLLECTIONS = [
  'businessProfile',
  'governmentSources',
  'regulations',
  'alerts',
  'complianceTasks',
  'domainConcentration',
  'calendarDeadlines',
  'notifications',
  'aiResponse',
  'dashboardSnapshot',
  'teamMembers',
];

await build({
  entryPoints: [seedEntry],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  outfile: bundlePath,
  logLevel: 'warning',
});

const mod = await import(pathToFileURL(bundlePath).href);

const corpus = {};
const missing = [];
for (const key of COLLECTIONS) {
  if (mod[key] === undefined) {
    missing.push(key);
    continue;
  }
  corpus[key] = mod[key];
}

rmSync(bundlePath, { force: true });

if (missing.length) {
  console.error('missing expected exports:', missing.join(', '));
  process.exit(1);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(corpus, null, 2)}\n`, 'utf8');

const counts = Object.entries(corpus).map(([k, v]) =>
  `${k}=${Array.isArray(v) ? v.length : 1}`,
);
console.log(`wrote ${outFile}`);
console.log(counts.join(' '));
