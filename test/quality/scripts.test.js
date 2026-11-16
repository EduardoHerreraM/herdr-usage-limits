import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { codeFiles, ROOT, shellFiles } from '../../tools/quality/files.mjs';
import { system } from './kit.mjs';

const LIMIT = { code: 300, test: 600 };

test('shellcheck passes on every shell script, read as POSIX sh', () => {
  const run = system('shellcheck', ['-s', 'sh', '-x', ...shellFiles()], 'brew install shellcheck');
  assert.equal(run.status, 0, run.stdout);
});

test('every shell, python and sql file stays under its line limit', () => {
  const over = codeFiles().filter(({ lang }) => lang !== 'javascript').flatMap(({ path, test: isTest }) => {
    const count = readFileSync(join(ROOT, path), 'utf8').split('\n').length - 1;
    const limit = isTest ? LIMIT.test : LIMIT.code;
    return count > limit ? [`${path}: ${count} lines, limit ${limit}`] : [];
  });
  assert.deepEqual(over, []);
});
