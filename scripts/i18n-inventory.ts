/**
 * String inventory generator (D-2.01, Task 10). Reads both message catalogs and writes
 * `docs/i18n/string-inventory.md` for the Phase 2.02 native-MK reviewers: every key, its MK value, its
 * EN value, and the page(s)/component(s) where it renders — plus two flag sections for human eyes.
 *
 *   npm run i18n:inventory
 *
 * "Where it renders" is derived by scanning the source tree for how each key is consumed:
 *   • a fully-qualified `t('Namespace.key')` anywhere, and
 *   • a bare `t('key')` inside a file that scopes that namespace via useTranslations/getTranslations.
 * This is a static heuristic, not a runtime trace — it is meant to point a reviewer at the right file,
 * not to be exhaustive. A key with no located site is flagged so a dead key is visible.
 *
 * No DB, no env, no network. Pure file IO so it is safe to run any time and in CI.
 */
import {readFileSync, writeFileSync, mkdirSync, readdirSync} from 'node:fs';
import {join, relative} from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const MESSAGES = join(ROOT, 'src', 'messages');
const OUT_DIR = join(ROOT, 'docs', 'i18n');
const OUT_FILE = join(OUT_DIR, 'string-inventory.md');
const SCAN_DIRS = ['src/app', 'src/components', 'src/lib'];

type Flat = Record<string, string>;

// Flatten a nested catalog into dot-path keys ("Nav.home"). Only string leaves exist in these catalogs.
function flatten(obj: Record<string, unknown>, prefix = ''): Flat {
  const out: Flat = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else if (v && typeof v === 'object') Object.assign(out, flatten(v as Record<string, unknown>, key));
  }
  return out;
}

function readCatalog(locale: string): Flat {
  return flatten(JSON.parse(readFileSync(join(MESSAGES, `${locale}.json`), 'utf8')));
}

// Collect every source file to scan.
function sourceFiles(): string[] {
  const files: string[] = [];
  for (const dir of SCAN_DIRS) {
    const abs = join(ROOT, dir);
    for (const entry of readdirSync(abs, {recursive: true, withFileTypes: true})) {
      if (!entry.isFile()) continue;
      if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
      // Node's Dirent.parentPath carries the containing dir for recursive reads.
      const parent = (entry as unknown as {parentPath: string}).parentPath;
      files.push(join(parent, entry.name));
    }
  }
  return files;
}

// For each file: which namespaces it scopes (useTranslations('X') / getTranslations('X') /
// getTranslations({namespace: 'X'})), and its raw text (for token matching).
interface FileInfo {
  path: string;
  text: string;
  namespaces: Set<string>;
}

function scan(files: string[]): FileInfo[] {
  const nsRe = /(?:useTranslations|getTranslations)\(\s*['"]([A-Za-z0-9_]+)['"]/g;
  const nsObjRe = /namespace:\s*['"]([A-Za-z0-9_]+)['"]/g;
  return files.map((path) => {
    const text = readFileSync(path, 'utf8');
    const namespaces = new Set<string>();
    for (const m of text.matchAll(nsRe)) namespaces.add(m[1]);
    for (const m of text.matchAll(nsObjRe)) namespaces.add(m[1]);
    return {path, text, namespaces};
  });
}

// Where does `Namespace.leaf` render? A file counts if it references the full key, OR it scopes the
// namespace and contains the bare leaf as a quoted translator argument.
function sites(fullKey: string, files: FileInfo[]): string[] {
  const dot = fullKey.indexOf('.');
  const ns = fullKey.slice(0, dot);
  const leaf = fullKey.slice(dot + 1);
  const fullTok = new RegExp(`['"]${escapeRe(fullKey)}['"]`);
  const leafTok = new RegExp(`['"]${escapeRe(leaf)}['"]`);
  const hits: string[] = [];
  for (const f of files) {
    const byFull = fullTok.test(f.text);
    const byLeaf = f.namespaces.has(ns) && leafTok.test(f.text);
    if (byFull || byLeaf) hits.push(relative(ROOT, f.path));
  }
  return [...new Set(hits)].sort();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cell(s: string): string {
  // Keep table cells single-line and pipe-safe.
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

// Curated list of legitimately-untranslated strings, so 2.02 reviewers do not report them as bugs
// (D-2.01, Task 4). Some live in the catalog (identical by design); some are constants outside it.
const INTENTIONALLY_UNTRANSLATED: {what: string; where: string; why: string}[] = [
  {what: 'Trajanov — the brand wordmark', where: 'Nav.brand, Home.title', why: 'A proper noun. Identical in both locales by design.'},
  {what: 'МК / EN — language pill labels', where: 'Common.languageMk, Common.languageEn', why: 'Each labels a language in its own script; the same in both builds.'},
  {what: '@trajanovv2026 — Instagram handle', where: 'src/lib/social.ts', why: 'A handle, not copy. facts.md §6. Not in the catalog.'},
  {what: '078 820 520 — phone number', where: 'src/lib/social.ts', why: 'A number, not copy. facts.md §5. Not in the catalog.'},
  {what: "About pull-quote — Vladimir's exact Трн.мк words", where: 'About.quote, About.quoteAttribution (MK)', why: 'A verbatim citation (D-1.05-6). The EN build renders a marked translation; the MK original is fixed.'},
  {what: 'Press outlet names + URLs', where: 'src/app/[locale]/about/page.tsx (PRESS[])', why: 'Data copied verbatim from facts.md §4 — proper nouns and links, not translatable copy.'},
  {what: 'Styleguide field labels ("Default", "Error", …)', where: 'src/app/[locale]/styleguide/page.tsx', why: 'Internal review aid, not a customer surface, not localised (D-2.01-4).'},
  {what: 'Dev-only preview labels', where: 'DevPreviewSwitch, HomeExperience PreviewBadge', why: 'Never rendered in production (returns null / preview refused when NODE_ENV=production).'},
];

function main(): void {
  const mk = readCatalog('mk');
  const en = readCatalog('en');
  const files = scan(sourceFiles());

  const keys = [...new Set([...Object.keys(mk), ...Object.keys(en)])].sort();
  const identical = keys.filter((k) => mk[k] !== undefined && mk[k] === en[k]);

  const lines: string[] = [];
  lines.push('# String inventory — Trajanov-V2');
  lines.push('');
  lines.push('> **Generated — do not edit by hand.** Regenerate with `npm run i18n:inventory`.');
  lines.push('> Source: `src/messages/mk.json` + `src/messages/en.json`. MK is the source language;');
  lines.push('> EN is a translation of it, not a paraphrase. For Phase 2.02 (native MK review).');
  lines.push('');
  lines.push(`**Keys:** ${keys.length} (MK and EN key sets are identical — enforced by \`tests/i18n/catalog-parity.test.ts\`).`);
  lines.push('');
  lines.push('The **Where** column is a static heuristic (see `scripts/i18n-inventory.ts`): it points at');
  lines.push('the file(s) that reference each key, to start a review — not an exhaustive render trace.');
  lines.push('');
  lines.push('| Key | MK | EN | Where |');
  lines.push('|---|---|---|---|');
  for (const k of keys) {
    const where = sites(k, files);
    const whereCell = where.length ? where.map((w) => `\`${w}\``).join('<br>') : '_(not found in source)_';
    lines.push(`| \`${k}\` | ${cell(mk[k] ?? '—')} | ${cell(en[k] ?? '—')} | ${whereCell} |`);
  }

  lines.push('');
  lines.push('## Intentionally not translated');
  lines.push('');
  lines.push('These are correct as-is — **not** review bugs.');
  lines.push('');
  lines.push('| String | Where | Why |');
  lines.push('|---|---|---|');
  for (const row of INTENTIONALLY_UNTRANSLATED) {
    lines.push(`| ${cell(row.what)} | ${cell(row.where)} | ${cell(row.why)} |`);
  }

  lines.push('');
  lines.push('## MK and EN values are byte-identical');
  lines.push('');
  lines.push('A flag list for human eyes — some are correct (proper nouns, symbols), some may want a');
  lines.push('different MK wording. **Not** an error on its own.');
  lines.push('');
  if (identical.length === 0) {
    lines.push('_(none)_');
  } else {
    lines.push('| Key | Value |');
    lines.push('|---|---|');
    for (const k of identical) lines.push(`| \`${k}\` | ${cell(mk[k])} |`);
  }
  lines.push('');

  mkdirSync(OUT_DIR, {recursive: true});
  writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
  console.log(`Wrote ${relative(ROOT, OUT_FILE)} — ${keys.length} keys, ${identical.length} byte-identical.`);
}

main();
