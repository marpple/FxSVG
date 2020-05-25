import { expect } from "chai";
import { $$createSVGRect } from "./createSVGRect.index.js";

describe(`$$createSVGRect`, () => {
  it(`will create SVGRect with given coordinates and width, height`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect()({ x, y, width, height });

    expect(rect.x).to.equal(x);
    expect(rect.y).to.equal(y);
    expect(rect.width).to.equal(width);
    expect(rect.height).to.equal(height);
  });

  it(`will use 0 as default coordinates and width, height`, () => {
    const rect = $$createSVGRect()();

    expect(rect.x).to.equal(0);
    expect(rect.y).to.equal(0);
    expect(rect.width).to.equal(0);
    expect(rect.height).to.equal(0);
  });

  it(`will use 0 as default x coordinate`, () => {
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect()({ y, width, height });

    expect(rect.x).to.equal(0);
    expect(rect.y).to.equal(y);
    expect(rect.width).to.equal(width);
    expect(rect.height).to.equal(height);
  });

  it(`will use 0 as default y coordinate`, () => {
    const x = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect()({ x, width, height });

    expect(rect.x).to.equal(x);
    expect(rect.y).to.equal(0);
    expect(rect.width).to.equal(width);
    expect(rect.height).to.equal(height);
  });

  it(`will use 0 as default width`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const height = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect()({ x, y, height });

    expect(rect.x).to.equal(x);
    expect(rect.y).to.equal(y);
    expect(rect.width).to.equal(0);
    expect(rect.height).to.equal(height);
  });

  it(`will use 0 as default height`, () => {
    const x = Math.round(Math.random() * 1000);
    const y = Math.round(Math.random() * 1000);
    const width = Math.round(Math.random() * 2000);

    const rect = $$createSVGRect()({ x, y, width });

    expect(rect.x).to.equal(x);
    expect(rect.y).to.equal(y);
    expect(rect.width).to.equal(width);
    expect(rect.height).to.equal(0);
  });
});
