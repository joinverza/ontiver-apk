import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIRS = ['app', 'components', 'constants', 'hooks', 'lib', 'providers', 'services', 'store', 'utils'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const FORBIDDEN_FIXTURES = [
  { label: 'Lorem Ipsum placeholder copy', pattern: /\blorem ipsum\b/i },
  { label: 'John Doe demo identity', pattern: /\bjohn doe\b/i },
  { label: 'Jane Doe demo identity', pattern: /\bjane doe\b/i },
  { label: 'legacy Chris Doe prototype identity', pattern: /\bchris doe\b/i },
  { label: 'legacy Nathan Adeyemi prototype identity', pattern: /\bnathan adeyemi\b/i },
  { label: 'hard-coded demo credential identifier', pattern: /\b(?:cred|credential)[_-](?:demo|mock|sample|test)(?:[_-][a-z0-9]+)?\b/i },
  { label: 'hard-coded demo account email', pattern: /\b(?:demo|mock|sample|test)(?:[._-][a-z0-9]+)*@(?!example\.com\b)[a-z0-9.-]+\.[a-z]{2,}\b/i },
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error) => {
    if (error?.code === 'ENOENT') return [];
    throw error;
  });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(path));
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const files = (await Promise.all(SOURCE_DIRS.map((directory) => sourceFiles(join(ROOT, directory))))).flat();
const findings = [];

for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split(/\r?\n/u);
  for (const [index, line] of lines.entries()) {
    for (const fixture of FORBIDDEN_FIXTURES) {
      if (fixture.pattern.test(line)) {
        findings.push(`${relative(ROOT, file)}:${index + 1}: ${fixture.label}`);
      }
    }
  }
}

if (findings.length) {
  console.error('Production fixture check failed. Replace demo identity data with backend-provided state:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Production fixture check passed (${files.length} source files scanned).`);
}
