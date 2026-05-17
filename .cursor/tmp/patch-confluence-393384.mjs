import fs from 'fs';

const inputPath = process.argv[2] || '.cursor/tmp/confluence-393384-body.md';
const outputPath = process.argv[3] || '.cursor/tmp/confluence-393384-updated.md';

const newRow =
  '| [**CURSO-69**](https://franciscocobsan.atlassian.net/browse/CURSO-69) | Formato de commits preferido `[CURSO-XX]` y `commit-format.conf` | `.cursor/commit-format.conf` (regex preferido y alternativo); `validate-commit.sh` (acepta `[CURSO-XX] …` y `tipo(CURSO-XX): …`); rule `jira-integration.mdc`; refs en `AGENTS.md` y `.cursor/README.md` |';

const anchor =
  'https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/655361) |\n\n### Backend API';
const replacement = `https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/655361) |\n${newRow}\n\n### Backend API`;

const body = fs.readFileSync(inputPath, 'utf8');
if (!body.includes(anchor)) {
  console.error('anchor not found');
  process.exit(1);
}
const updated = body.replace(anchor, replacement);
fs.writeFileSync(outputPath, updated, 'utf8');
console.log(
  JSON.stringify({
    inputLen: body.length,
    outputLen: updated.length,
    hasCurso69: updated.includes('CURSO-69'),
    hasBackendApi: updated.includes('### Backend API (Node / Express)'),
  })
);
