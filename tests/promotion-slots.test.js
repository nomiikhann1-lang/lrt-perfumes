import test from "node:test";
import assert from "node:assert/strict";
import { promotionSlots } from "../lib/shop-promotions.js";
test("films stay on an outside column after row one as the grid grows", () => {
  const campaigns = ["one", "two"],
    starts = new Set();
  for (let seed = 0; seed < 100; seed++) {
    const slots = promotionSlots(91, campaigns, seed * 7579);
    let preceding = 0;
    for (const [index, film] of slots) {
      const tile = index + preceding + 1;
      assert(tile > 4 && (tile % 4 === 0 || tile % 4 === 1));
      assert(index < 91);
      assert.equal(film, campaigns[preceding % 2]);
      if (!preceding) starts.add(tile);
      preceding++;
    }
    assert.deepEqual(
      [...promotionSlots(40, campaigns, seed * 7579)],
      [...slots].filter(([index]) => index < 40),
    );
  }
  assert.deepEqual([...starts].sort(), [5, 8]);
  assert.equal(promotionSlots(4, campaigns, 12).size, 0);
});
