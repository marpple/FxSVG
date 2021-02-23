import chai from "chai";
import { defaultTo, equals2, isUndefined, mapL, rangeL } from "fxjs/es";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomNumberExcept } from "../../test/utils/makeRandomNumberExcept.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$LiveScaleTransform2 } from "./LiveScaleTransform2.index.js";

const { expect } = chai;

const DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const setupMock = ({
  x: _x,
  y: _y,
  width: _width,
  height: _height,
  cx: _cx,
  cy: _cy,
  sx: _sx,
  sy: _sy,
  index: _index,
  transform: _transform,
} = {}) => {
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const [sx, sy, cx, cy, x, y] = mapL(
    (a) => defaultTo(makeRandomNumber(-100, 100), a),
    [_sx, _sy, _cx, _cy, _x, _y]
  );
  const [width, height] = mapL(
    (a) => defaultTo(makeRandomNumberExcept(0, 1000, [0]), a),
    [_width, _height]
  );
  const $el = makeMockRect({ x, y, width, height, transform });
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );

  return {
    x_name: "x",
    y_name: "y",
    width_name: "width",
    height_name: "height",
    is_need_correction: true,
    cx,
    cy,
    sx,
    sy,
    index,
    transform,
    $el,
    direction: DIRECTIONS[makeRandomInt(0, 8)],
  };
};

export default ({ describe, it }) => [
  describe(`$$LiveScaleTransform2`, function () {
    it(`The $$create static method makes a new instance with the input values.`, function () {
      const {
        sx,
        sy,
        cx,
        cy,
        index,
        $el,
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
      } = setupMock();

      const live_scale_transform = $$LiveScaleTransform2.$$create({
        index,
        cx,
        cy,
        sx,
        sy,
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
      })($el);

      expect(live_scale_transform).instanceof($$LiveScaleTransform2);
      expect($$isScaleSVGTransform(live_scale_transform.transform)).true;
      expect(
        $$isScaleSVGTransform($$getBaseTransformList($el).getItem(index + 1))
      ).true;
      expect(live_scale_transform.transform).deep.equal(
        $$getBaseTransformList($el).getItem(index + 1)
      );
      expect(live_scale_transform.transform).deep.equal(
        $$createSVGTransformScale({ sx, sy })()
      );
    });

    it(`The "$$update" method updates the transforms sx, sy values.`, function () {
      const {
        sx,
        sy,
        cx,
        cy,
        index,
        $el,
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
      } = setupMock();
      const live_scale_transform = $$LiveScaleTransform2.$$create({
        index,
        cx,
        cy,
        sx,
        sy,
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
      })($el);
      const [new_sx, new_sy] = mapL(
        () => makeRandomNumber(-100, 100),
        rangeL(2)
      );

      live_scale_transform.$$update({ sx: new_sx, sy: new_sy });

      expect(live_scale_transform.transform).deep.equal(
        $$createSVGTransformScale({ sx: new_sx, sy: new_sy })()
      );
    });

    it(`The "$$merge" methods merge the three transforms to the element.`, function () {
      const [x1, y1, cx, cy, sx, sy] = mapL(
        () => makeRandomInt(-100, 100),
        rangeL(6)
      );
      const [width1, height1] = mapL(() => makeRandomInt(1, 100), rangeL(2));
      const {
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
        index,
        $el,
      } = setupMock({
        x: x1,
        y: y1,
        cx,
        cy,
        sx,
        sy,
        width: width1,
        height: height1,
      });
      const live_scale_transform = $$LiveScaleTransform2.$$create({
        index,
        cx,
        cy,
        sx,
        sy,
        x_name,
        y_name,
        width_name,
        height_name,
        is_need_correction,
        direction,
      })($el);
      const { numberOfItems: l1 } = $$getBaseTransformList($el);

      live_scale_transform.$$merge();

      const [x2, y2, width2, height2] = mapL(
        (k) => parseFloat($$getAttrNS(k)($el)),
        [x_name, y_name, width_name, height_name]
      );
      let expect_x;
      if (equals2(direction, "n") || equals2(direction, "s")) {
        expect_x = x1;
      } else if (sx >= 0 || !is_need_correction) {
        expect_x = (x1 - cx) * sx + cx;
      } else {
        expect_x = (x1 - cx) * sx + cx + width1 * sx;
      }
      let expect_y;
      if (equals2(direction, "e") || equals2(direction, "w")) {
        expect_y = y1;
      } else if (sy >= 0 || !is_need_correction) {
        expect_y = (y1 - cy) * sy + cy;
      } else {
        expect_y = (y1 - cy) * sy + cy + height1 * sy;
      }

      const { numberOfItems: l2 } = $$getBaseTransformList($el);
      expect(l2).equal(l1 - 3);
      expect(width2).equal(width1 * Math.abs(sx));
      expect(height2).equal(height1 * Math.abs(sy));
      expect(x2).equal(expect_x);
      expect(y2).equal(expect_y);
    });
  }),
];
