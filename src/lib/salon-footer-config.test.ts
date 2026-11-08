import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FOOTER_COLUMNS, SALON_BRANCHES, getBranchById } from './salon-footer-config';

test('only the Kotecha Circle Rajkot location is listed', () => {
  assert.equal(SALON_BRANCHES.length, 1);
  assert.equal(SALON_BRANCHES[0].city, 'Rajkot');
  assert.match(SALON_BRANCHES[0].address, /Karunanidhan Complex/);
  assert.equal(getBranchById('unknown').id, 'rajkot-kotecha');
});

test('footer links point to live site sections or contact destinations', () => {
  const links = FOOTER_COLUMNS.flatMap(column => column.links);
  assert.ok(links.every(link => ['#home', '#our-services', '#about'].includes(link.href) || link.href.startsWith('https://')));
  assert.ok(links.some(link => link.href.includes('wa.me/919638055173')));
});
