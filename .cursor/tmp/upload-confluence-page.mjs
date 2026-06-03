import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const body = fs.readFileSync(join(dir, 'confluence-393384-updated.md'), 'utf8');
const payload = {
  cloudId: 'franciscocobsan.atlassian.net',
  pageId: '393384',
  title: 'curso cursor + angular',
  contentFormat: 'markdown',
  versionMessage: 'CURSO-69: añadir fila toolbox tras CURSO-15',
  body,
};
fs.writeFileSync(join(dir, 'update-payload.json'), JSON.stringify(payload), 'utf8');
console.log('payload body length:', body.length);
