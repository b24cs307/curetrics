import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const prismaCli = resolve(root, 'node_modules', 'prisma', 'build', 'index.js');
const serverDir = resolve(root, 'server');

if (!existsSync(prismaCli)) {
  console.error('Prisma CLI is missing. Run npm install, then npm run dev again.');
  process.exit(1);
}

const env = { ...process.env };
// Client generation needs a URL in Prisma config, but does not connect to it.
env.DATABASE_URL ||= 'postgresql://postgres:postgres@localhost:5432/curetrics?schema=public';

const result = spawnSync(process.execPath, [prismaCli, 'generate'], {
  cwd: serverDir,
  env,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
