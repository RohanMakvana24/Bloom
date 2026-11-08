import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  VISIT_LANDMARKS,
  SALON_COORDINATES,
  getVisitLandmark,
  getNextVisitLandmark,
  buildGoogleMapsEmbedUrl,
  clampMapZoom,
  formatCoordinatesLabel,
  getSalonSummaryCard,
} from './salon-visit-config';

describe('salon-visit-config', () => {
  it('defines 4 Rajkot fly-to landmarks starting with the flagship salon at Kotecha Circle', () => {
    assert.equal(VISIT_LANDMARKS.length, 4);
    const primary = getVisitLandmark('salon-flagship');
    assert.equal(primary.isPrimarySalon, true);
    assert.deepEqual(primary.coordinates, SALON_COORDINATES);
    assert.match(primary.description, /Fitness 5 Gym/);
    assert.match(primary.description, /360007/);
  });

  it('cycles forward and backward through landmarks cleanly', () => {
    const second = getNextVisitLandmark('salon-flagship', 1);
    assert.equal(second.id, 'kotecha-circle');

    const wrappedBack = getNextVisitLandmark('salon-flagship', -1);
    assert.equal(wrappedBack.id, 'race-course');
  });

  it('builds valid road and satellite Google Maps embed URLs and clamps zoom bounds', () => {
    const primary = getVisitLandmark('salon-flagship');
    const roadUrl = buildGoogleMapsEmbedUrl(primary, 'road', 17);
    assert.match(roadUrl, /^https:\/\/maps\.google\.com\/maps\?q=/);
    assert.match(roadUrl, /&t=m&z=17&/);
    assert.match(decodeURIComponent(roadUrl), /Fitness 5 gym, Kotecha Cir/);

    const satUrl = buildGoogleMapsEmbedUrl(primary, 'satellite', 25);
    assert.match(satUrl, /&t=h&z=19&/);
    assert.equal(clampMapZoom(10), 13);
    assert.equal(formatCoordinatesLabel(SALON_COORDINATES), '22.2916° N · 70.7766° E');
  });

  it('returns consistent salon summary card metadata', () => {
    const summary = getSalonSummaryCard();
    assert.equal(summary.pincode, '360007');
    assert.match(summary.address, /Karunanidhan Complex/);
  });
});
