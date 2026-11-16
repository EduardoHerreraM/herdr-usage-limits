import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { tool } from './kit.mjs';

function clones() {
  const out = mkdtempSync(join(tmpdir(), 'jscpd-'));
  try {
    tool('jscpd', ['--config', '.jscpd.json', '--output', out, 'mods', 'tools', 'test']);
    return JSON.parse(readFileSync(join(out, 'jscpd-report.json'), 'utf8')).duplicates
      .map((d) => `${d.firstFile.name}:${d.firstFile.start}-${d.firstFile.end} = ${d.secondFile.name}:${d.secondFile.start}-${d.secondFile.end}`);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

test('no copied code: a repeat becomes one shared function', () => {
  assert.deepEqual(clones(), []);
});
