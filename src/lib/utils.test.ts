import test from 'node:test';
import assert from 'node:assert/strict';
import { cn, resolveThemeMode, getNextTheme } from './utils';

test('cn combines strings, conditionals, and arrays cleanly', () => {
  assert.equal(cn('fixed top-0', undefined, false && 'hidden', 'z-50'), 'fixed top-0 z-50');
  assert.equal(cn(['flex', 'items-center'], { 'gap-2': true, 'gap-4': false }), 'flex items-center gap-2');
});

test('resolveThemeMode returns explicit light or dark and falls back to systemTheme', () => {
  assert.equal(resolveThemeMode('dark', 'light'), 'dark');
  assert.equal(resolveThemeMode('light', 'dark'), 'light');
  assert.equal(resolveThemeMode('system', 'dark'), 'dark');
  assert.equal(resolveThemeMode('system', 'light'), 'light');
  assert.equal(resolveThemeMode(undefined, 'dark'), 'dark');
});

test('getNextTheme toggles between dark and light accurately', () => {
  assert.equal(getNextTheme('dark', 'dark'), 'light');
  assert.equal(getNextTheme('light', 'dark'), 'dark');
  assert.equal(getNextTheme('system', 'dark'), 'light');
  assert.equal(getNextTheme('system', 'light'), 'dark');
});
