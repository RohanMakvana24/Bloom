import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SALON_ADDRESS, SALON_MAPS, SALON_TEL, whatsappEnquiry } from './salon-contact';

test('Rajkot contact links target the published salon phone and location', () => {
  assert.equal(SALON_TEL, 'tel:+919638055173');
  assert.match(SALON_ADDRESS, /Karunanidhan Complex/);
  assert.match(decodeURIComponent(SALON_MAPS), /Kotecha Circle Rajkot/);
});

test('WhatsApp enquiry preserves the message and uses the salon phone', () => {
  const url = new URL(whatsappEnquiry('Name: Mira\nPlease confirm availability.'));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/919638055173');
  assert.equal(url.searchParams.get('text'), 'Name: Mira\nPlease confirm availability.');
});
