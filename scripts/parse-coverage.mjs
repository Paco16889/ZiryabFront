import fs from 'fs';

const html = fs.readFileSync('documentation/coverage.html', 'utf8');
const rows = [...html.matchAll(/<tr class="(low|medium|good|very-low)">([\s\S]*?)<\/tr>/g)];
const items = [];

for (const m of rows) {
  const block = m[2];
  const srcMatch = block.match(/>(src\/[^<]+)<\/a>/);
  const src = srcMatch ? srcMatch[1] : '';
  const pctMatch = block.match(/coverage-percent">([^%]+)/);
  const pct = pctMatch ? pctMatch[1].trim() : '';
  const countMatch = block.match(/coverage-count">\(([^)]+)\)/);
  const count = countMatch ? countMatch[1] : '';
  const cells = [...block.matchAll(/<td>([^<]*)<\/td>/g)].map((x) => x[1].trim());
  const type = cells[1] || '';
  const id = cells[2] || '';
  items.push({ pct, count, type, id, src });
}

console.log('Total non-very-good:', items.length);
items.sort((a, b) => parseFloat(a.pct) - parseFloat(b.pct));
for (const i of items) {
  console.log(`${i.pct}% (${i.count}) ${i.type} ${i.id} @ ${i.src}`);
}

const byFile = {};
for (const i of items) {
  const f = i.src || 'unknown';
  byFile[f] = (byFile[f] || 0) + 1;
}
console.log('\nBy source file:');
Object.entries(byFile)
  .sort((a, b) => b[1] - a[1])
  .forEach(([f, c]) => console.log(`${c}\t${f}`));
