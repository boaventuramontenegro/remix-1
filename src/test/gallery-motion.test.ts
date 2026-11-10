import { describe, expect, it } from "vitest";
// @ts-expect-error Gallery animation is an untyped JavaScript component.
import { columnVelocity } from "@/components/site/DriftWall";

describe("gallery column movement", () => {
  it("uses the same 12 pixels per second for every column, regardless of content height", () => {
    const heights = [624, 624, 468, 468, 468];
    const elapsed = 2;
    const distances = heights.map((height, index) => {
      const offset = height / 2;
      const next = ((offset + columnVelocity(index, 12, "up") * elapsed) % height + height) % height;
      return Math.abs(next - offset);
    });
    expect(distances).toEqual([24, 24, 24, 24, 24]);
  });

  it("preserves the alternating up/down directions", () => {
    expect([0, 1, 2, 3, 4].map(index => columnVelocity(index, 12, "up")))
      .toEqual([12, -12, 12, -12, 12]);
    expect([0, 1, 2].map(index => columnVelocity(index, 12, "down")))
      .toEqual([-12, 12, -12]);
  });
});