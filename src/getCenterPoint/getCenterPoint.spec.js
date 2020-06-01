import { expect } from "chai";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$el } from "../el/el.index.js";
import { $$getBoxPoints } from "../getBoxPoints/getBoxPoints.index.js";
import { $$getCenterPoint } from "./getCenterPoint.index.js";

describe(`$$getCenterPoint`, function () {
  let $svg;
  let $el;

  beforeEach(function () {
    $svg = $$el()(`
      <svg width="1000" height="1000" viewBox="0 0 2000 2000" preserveAspectRatio="xMinYMin meet"></svg> 
    `);
    $el = $$el()(`
      <rect
        x="${makeRandomInt(-1000, 1000)}"
        y="${makeRandomInt(-1000, 1000)}"
        width="${makeRandomInt(10, 1000)}"
        height="${makeRandomInt(10, 1000)}"
      >
      </rect> 
    `);

    document.body.appendChild($svg);
    $svg.appendChild($el);
  });

  afterEach(function () {
    $svg.removeChild($el);
    document.body.removeChild($svg);
  });

  it(`The original point is a center of points from $$getBoxPoints().original.`, function () {
    const {
      original: {
        top_left: { x: x1, y: y1 },
        top_right: { x: x2, y: y2 },
        bottom_right: { x: x3, y: y3 },
        bottom_left: { x: x4, y: y4 },
      },
    } = $$getBoxPoints()($el);
    const { original } = $$getCenterPoint()($el);

    expect(original.x * 4).to.equal(x1 + x2 + x3 + x4);
    expect(original.y * 4).to.equal(y1 + y2 + y3 + y4);
  });

  it(`The transformed point is a center of points from $$getBoxPoints().transformed.`, function () {
    const {
      transformed: {
        top_left: { x: x1, y: y1 },
        top_right: { x: x2, y: y2 },
        bottom_right: { x: x3, y: y3 },
        bottom_left: { x: x4, y: y4 },
      },
    } = $$getBoxPoints()($el);
    const { transformed } = $$getCenterPoint()($el);

    expect(transformed.x * 4).to.equal(x1 + x2 + x3 + x4);
    expect(transformed.y * 4).to.equal(y1 + y2 + y3 + y4);
  });
});
