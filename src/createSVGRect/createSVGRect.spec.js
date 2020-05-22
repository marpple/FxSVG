import { createSVGWindow } from "svgdom";
import { $$createSVGRect } from "./createSVGRect.index.js";

describe(`$$createSVGRect`, () => {
  let $dummy_svg;

  beforeEach(() => {
    $dummy_svg = createSVGWindow().document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  });

  test(`will create SVGRect with given coordinates and width, height`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect($dummy_svg)({ x, y, width, height });

    expect(rect.x).toEqual(x);
    expect(rect.y).toEqual(y);
    expect(rect.width).toEqual(width);
    expect(rect.height).toEqual(height);
  });

  test(`will use 0 as default coordinates and width, height`, () => {
    const rect = $$createSVGRect($dummy_svg)();

    expect(rect.x).toEqual(0);
    expect(rect.y).toEqual(0);
    expect(rect.width).toEqual(0);
    expect(rect.height).toEqual(0);
  });

  test(`will use 0 as default x coordinate`, () => {
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect($dummy_svg)({ y, width, height });

    expect(rect.x).toEqual(0);
    expect(rect.y).toEqual(y);
    expect(rect.width).toEqual(width);
    expect(rect.height).toEqual(height);
  });

  test(`will use 0 as default y coordinate`, () => {
    const x = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect($dummy_svg)({ x, width, height });

    expect(rect.x).toEqual(x);
    expect(rect.y).toEqual(0);
    expect(rect.width).toEqual(width);
    expect(rect.height).toEqual(height);
  });

  test(`will use 0 as default width`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect($dummy_svg)({ x, y, height });

    expect(rect.x).toEqual(x);
    expect(rect.y).toEqual(y);
    expect(rect.width).toEqual(0);
    expect(rect.height).toEqual(height);
  });

  test(`will use 0 as default height`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect($dummy_svg)({ x, y, width });

    expect(rect.x).toEqual(x);
    expect(rect.y).toEqual(y);
    expect(rect.width).toEqual(width);
    expect(rect.height).toEqual(0);
  });
});
