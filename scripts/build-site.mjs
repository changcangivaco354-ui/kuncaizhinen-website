import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'dist');
const excluded = new Set(['.git', 'dist', 'products', 'scripts', 'netlify.toml']);

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  fs.cpSync(path.join(root, entry.name), path.join(output, entry.name), { recursive: true });
}

const productDir = path.join(root, 'products');
const products = fs.existsSync(productDir)
  ? fs.readdirSync(productDir)
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map((name) => JSON.parse(fs.readFileSync(path.join(productDir, name), 'utf8')))
  : [];

fs.writeFileSync(path.join(output, 'products.json'), JSON.stringify({ products }, null, 2) + '\n');
console.log(`Built site with ${products.length} products.`);

