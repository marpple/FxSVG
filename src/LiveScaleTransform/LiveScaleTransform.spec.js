import chai from "chai";
import { defaultTo, isUndefined, mapL, rangeL } from "fxjs/esm";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomNumberExcept } from "../../test/utils/makeRandomNumberExcept.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$LiveScaleTransform } from "./LiveScaleTransform.index.js";

const { expect } = chai;

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
    cx,
    cy,
    sx,
    sy,
    index,
    transform,
    $el,
  };
};

export default ({ describe, it }) => [
  describe(`$$LiveScaleTransform`, function () {
    it(`The $$create static method makes a new instance with the input values.`, function () {
      const { sx, sy, cx, cy, index, $el } = setupMock();

      const live_scale_transform = $$LiveScaleTransform.$$create({
        index,
        cx,
        cy,
        sx,
        sy,
      })($el);

      expect(live_scale_transform).instanceof($$LiveScaleTransform);
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
      const { cx, cy, sx, sy, index, $el } = setupMock();
      const live_scale_transform = $$LiveScaleTransform.$$create({
        index,
        cx,
        cy,
        sx,
        sy,
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

    it(`The "$$merge" methods merge the three transforms to the one merged transform.`, function () {
      const [cx, cy, sx, sy] = mapL(
        () => makeRandomNumber(-100, 100),
        rangeL(4)
      );
      const { index, $el } = setupMock({ cx, cy, sx, sy });
      const live_scale_transform = $$LiveScaleTransform.$$create({
        index,
        sx,
        sy,
        cx,
        cy,
      })($el);
      const { numberOfItems: l1 } = $$getBaseTransformList($el);
      const transform1 = $$createSVGTransformMatrix({
        matrix: $$createSVGTransformTranslate({
          tx: cx,
          ty: cy,
        })()
          .matrix.multiply($$createSVGTransformScale({ sx, sy })().matrix)
          .multiply(
            $$createSVGTransformTranslate({ tx: -cx, ty: -cy })().matrix
          ),
      })();

      live_scale_transform.$$merge();

      const { numberOfItems: l2 } = $$getBaseTransformList($el);
      const transform2 = $$getBaseTransformList($el).getItem(index);
      expect(l2).equal(l1 - 2);
      expect(transform2).deep.equal(transform1);
    });
  }),
];
