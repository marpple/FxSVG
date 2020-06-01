import { expect } from "chai";
import { go, map } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getBoxPoints } from "./getBoxPoints.index.js";

describe(`$$getBoxPoints`, function () {
  let x;
  let y;
  let width;
  let height;
  let $svg;
  let $el;

  beforeEach(function () {
    x = makeRandomInt(-1000, 1000);
    y = makeRandomInt(-1000, 1000);
    width = makeRandomInt(10, 1000);
    height = makeRandomInt(10, 1000);

    $svg = $$el()(`
      <svg width="1000" height="1000" viewBox="0 0 2000 2000" preserveAspectRatio="xMinYMin meet"></svg> 
    `);
    $el = $$el()(`
      <rect
        x="${x}"
        y="${y}"
        width="${width}"
        height="${height}"
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

  it(`
  The return value's original points are calculated from the initial attributes about the element's position.
  `, function () {
    const {
      original: { top_left, top_right, bottom_right, bottom_left },
    } = $$getBoxPoints()($el);

    expect(top_left.x).to.equal(x);
    expect(top_left.y).to.equal(y);

    expect(top_right.x).to.equal(x + width);
    expect(top_right.y).to.equal(y);

    expect(bottom_right.x).to.equal(x + width);
    expect(bottom_right.y).to.equal(y + height);

    expect(bottom_left.x).to.equal(x);
    expect(bottom_left.y).to.equal(y + height);
  });

  it(`
  If there is no transform, transformed points and original points will be same. 
  `, function () {
    $el.removeAttributeNS(null, "transform");

    const { original, transformed } = $$getBoxPoints()($el);

    expect(transformed).to.deep.equal(original);
  });

  it(`
  If there are transforms,
  transformed points are same with the points that applied by the transforms.
  `, function () {
    $el.setAttributeNS(null, "transform", makeRandomTransformAttributeValue(1));

    const { matrix } = $$getBaseTransformList($el).consolidate();
    const { original, transformed } = $$getBoxPoints()($el);

    expect(transformed.top_left).to.deep.equal(
      original.top_left.matrixTransform(matrix)
    );
    expect(transformed.top_right).to.deep.equal(
      original.top_right.matrixTransform(matrix)
    );
    expect(transformed.bottom_right).to.deep.equal(
      original.bottom_right.matrixTransform(matrix)
    );
    expect(transformed.bottom_left).to.deep.equal(
      original.bottom_left.matrixTransform(matrix)
    );
  });

  describe(`
  The bounding points are same with the points whose x, y are minimum and maximum of transformed points.
  
  bounding.min = (min(transformed.xs), min(transformed.ys))
  bounding.max = (max(transformed.xs), max(transformed.ys))
  `, function () {
    it(`The element have no transforms.`, function () {
      $el.removeAttributeNS(null, "transform");

      const { transformed, bounding } = $$getBoxPoints()($el);
      const transformed_list = [
        transformed.top_left,
        transformed.top_right,
        transformed.bottom_right,
        transformed.bottom_left,
      ];
      const [min_x, max_x] = go(
        transformed_list,
        map(({ x }) => x),
        (xs) => [Math.min(...xs), Math.max(...xs)]
      );
      const [min_y, max_y] = go(
        transformed_list,
        map(({ y }) => y),
        (ys) => [Math.min(...ys), Math.max(...ys)]
      );
      expect(bounding.min.x).to.equal(min_x);
      expect(bounding.min.y).to.equal(min_y);
      expect(bounding.max.x).to.equal(max_x);
      expect(bounding.max.y).to.equal(max_y);
    });

    it(`The element have transforms.`, function () {
      $el.setAttributeNS(
        null,
        "transform",
        makeRandomTransformAttributeValue(1)
      );

      const { transformed, bounding } = $$getBoxPoints()($el);
      const transformed_list = [
        transformed.top_left,
        transformed.top_right,
        transformed.bottom_right,
        transformed.bottom_left,
      ];
      const [min_x, max_x] = go(
        transformed_list,
        map(({ x }) => x),
        (xs) => [Math.min(...xs), Math.max(...xs)]
      );
      const [min_y, max_y] = go(
        transformed_list,
        map(({ y }) => y),
        (ys) => [Math.min(...ys), Math.max(...ys)]
      );
      expect(bounding.min.x).to.equal(min_x);
      expect(bounding.min.y).to.equal(min_y);
      expect(bounding.max.x).to.equal(max_x);
      expect(bounding.max.y).to.equal(max_y);
    });
  });
});
