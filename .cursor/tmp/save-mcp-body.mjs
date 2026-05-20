import fs from 'fs';

// Body from getConfluencePage (page 393384, v11) — written via JSON.parse of escaped string
const raw = fs.readFileSync(new URL('./confluence-393384-body.json', import.meta.url), 'utf8');
const { body } = JSON.parse(raw);
fs.writeFileSync(new URL('./confluence-393384-body.md', import.meta.url), body, 'utf8');
console.log('saved', body.length, 'chars');
