import { readdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const root = '/app/dist/gamevault/browser';
const main = readdirSync(root).find(name => /^main.*\.js$/.test(name));
assert.ok(main, 'Debe existir un bundle de producción');
assert.ok(!readFileSync(`${root}/${main}`, 'utf8').includes('[DEMO LOCAL]'), 'El logging de JWT debe eliminarse en producción');
assert.ok(!readFileSync(`${root}/${main}`, 'utf8').includes('logLocalDemoToken'), 'No debe quedar el logger');
console.log('PASS: bundle de producción compilado sin el logging de JWT de demostración');
