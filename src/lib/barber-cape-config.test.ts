import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BARBER_CAPE_CONFIG,
  computeDualWingCapeDisplacement,
  createRealisticCapePanelTexture,
  createRealisticCapeBumpTexture,
} from './barber-cape-config';

describe('dual-wing-center-split-barber-cape', () => {
  it('has valid animation timing configuration', () => {
    assert.ok(BARBER_CAPE_CONFIG.liftDurationMs > 0);
  });

  it('computes natural drape folds when progress is 0', () => {
    const leftDisp = computeDualWingCapeDisplacement({
      panel: 'left',
      ix: 10,
      iy: 10,
      totalX: 20,
      totalY: 20,
      progress: 0,
      time: 1.0,
    });
    assert.equal(leftDisp.x, 0);
    assert.equal(leftDisp.y, 0);
    assert.ok(typeof leftDisp.z === 'number');

    const rightDisp = computeDualWingCapeDisplacement({
      panel: 'right',
      ix: 10,
      iy: 10,
      totalX: 20,
      totalY: 20,
      progress: 0,
      time: 1.0,
    });
    assert.equal(rightDisp.x, 0);
    assert.equal(rightDisp.y, 0);
    assert.ok(typeof rightDisp.z === 'number');
  });

  it('center-split: left wing moves LEFT (-X) and right wing moves RIGHT (+X)', () => {
    const leftMid = computeDualWingCapeDisplacement({
      panel: 'left',
      ix: 19, // center seam edge (u = 1)
      iy: 10,
      totalX: 20,
      totalY: 20,
      progress: 0.7,
      time: 2.0,
    });

    const rightMid = computeDualWingCapeDisplacement({
      panel: 'right',
      ix: 0, // center seam edge (u = 0)
      iy: 10,
      totalX: 20,
      totalY: 20,
      progress: 0.7,
      time: 2.0,
    });

    assert.ok(leftMid.x < -1.0, `Left panel must move to the left (-X), got ${leftMid.x}`);
    assert.ok(rightMid.x > 1.0, `Right panel must move to the right (+X), got ${rightMid.x}`);
    assert.ok(leftMid.z > 0.5, 'Left panel must billow forward in 3D');
    assert.ok(rightMid.z > 0.5, 'Right panel must billow forward in 3D');
  });

  it('exports procedural realistic fabric and bump textures', () => {
    assert.equal(typeof createRealisticCapePanelTexture, 'function');
    assert.equal(typeof createRealisticCapeBumpTexture, 'function');
  });
});
