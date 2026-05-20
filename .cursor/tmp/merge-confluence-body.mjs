import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const newRow =
  '| [**CURSO-69**](https://franciscocobsan.atlassian.net/browse/CURSO-69) | Formato de commits preferido `[CURSO-XX]` y `commit-format.conf` | `.cursor/commit-format.conf` (regex preferido y alternativo); `validate-commit.sh` (acepta `[CURSO-XX] …` y `tipo(CURSO-XX): …`); rule `jira-integration.mdc`; refs en `AGENTS.md` y `.cursor/README.md` |';

const part1 = fs.readFileSync(join(dir, 'confluence-part1.md'), 'utf8');
const part2 = fs.readFileSync(join(dir, 'confluence-part2.md'), 'utf8');
const updated = `${part1.trimEnd()}\n${newRow}\n\n${part2}`;
fs.writeFileSync(join(dir, 'confluence-393384-updated.md'), updated, 'utf8');
console.log(
  JSON.stringify({
    length: updated.length,
    hasCurso69: updated.includes('CURSO-69'),
    hasBackendApi: updated.includes('### Backend API (Node / Express)'),
    afterCurso15: updated.includes('CURSO-15') && updated.indexOf('CURSO-69') > updated.indexOf('CURSO-15'),
  })
);
