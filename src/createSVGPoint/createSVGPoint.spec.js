import { createSVGWindow } from "svgdom";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

describe(`$$createSVGPoint`, () => {
  let $dummy_svg;

  beforeEach(() => {
    const window = createSVGWindow();
    $dummy_svg = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  });

  test(`will create SVGPoint with given coordinates`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const p = $$createSVGPoint($dummy_svg)({ x, y });

    expect(p.x).toEqual(x);
    expect(p.y).toEqual(y);
  });

  test("will use 0 as default coordinates", () => {
    const p = $$createSVGPoint($dummy_svg)();

    expect(p.x).toEqual(0);
    expect(p.y).toEqual(0);
  });

  test("will use 0 as default x coordinate", () => {
    const p = $$createSVGPoint($dummy_svg)({ y: 10 });

    expect(p.x).toEqual(0);
  });

  test("will use 0 as default y coordinate", () => {
    const p = $$createSVGPoint($dummy_svg)({ x: 10 });

    expect(p.y).toEqual(0);
  });
});
