import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const mcpPath = join(dir, 'mcp-get-page-393384.json');
if (!fs.existsSync(mcpPath)) {
  console.error('Missing', mcpPath);
  process.exit(1);
}
const page = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
const body = page.body ?? page;
if (typeof body !== 'string') {
  console.error('No body string in MCP JSON');
  process.exit(1);
}
fs.writeFileSync(join(dir, 'confluence-393384-body.md'), body, 'utf8');
fs.writeFileSync(
  join(dir, 'confluence-393384-body.json'),
  JSON.stringify({ body }),
  'utf8'
);
console.log('body length:', body.length);
