import { expect } from "chai";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

describe(`$$createSVGPoint`, () => {
  it(`will create SVGPoint with given coordinates`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const p = $$createSVGPoint()({ x, y });

    expect(p.x).to.equal(x);
    expect(p.y).to.equal(y);
  });

  it("will use 0 as default coordinates", () => {
    const p = $$createSVGPoint()();

    expect(p.x).to.equal(0);
    expect(p.y).to.equal(0);
  });

  it("will use 0 as default x coordinate", () => {
    const p = $$createSVGPoint()({ y: 10 });

    expect(p.x).to.equal(0);
  });

  it("will use 0 as default y coordinate", () => {
    const p = $$createSVGPoint()({ x: 10 });

    expect(p.y).to.equal(0);
  });
});
