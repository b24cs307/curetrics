import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const enginesDir = resolve(root, 'node_modules', '@prisma', 'engines');
const engineName = readdirSync(enginesDir).find((name) => /^query_engine-.+\.node$/.test(name));
const enginePath = engineName ? resolve(enginesDir, engineName) : '';
const prismaCli = resolve(root, 'node_modules', 'prisma', 'build', 'index.js');

if (!existsSync(prismaCli)) {
  console.error('Prisma CLI is missing. Run npm install, then npm run dev again.');
  process.exit(1);
}

const env = { ...process.env };
if (enginePath && existsSync(enginePath)) env.PRISMA_QUERY_ENGINE_LIBRARY ||= enginePath;
// Client generation only needs a syntactically valid URL; the running API
// continues to read the real DATABASE_URL from .env at runtime.
env.DATABASE_URL ||= 'postgresql://postgres:postgres@localhost:5432/curetrics?schema=public';

const result = spawnSync(process.execPath, [prismaCli, 'generate', '--schema', resolve(root, 'server', 'prisma', 'schema.prisma')], {
  cwd: root,
  env,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
