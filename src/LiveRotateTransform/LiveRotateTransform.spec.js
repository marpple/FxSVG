import chai from "chai";
import { defaultTo, isUndefined, mapL } from "fxjs/esm";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$LiveRotateTransform } from "./LiveRotateTransform.index.js";

const { expect } = chai;

const setupMock = ({
  angle: _angle,
  cx: _cx,
  cy: _cy,
  index: _index,
  transform: _transform,
} = {}) => {
  const angle = defaultTo(makeRandomNumber(-700, 700), _angle);
  const [cx, cy] = mapL((a) => defaultTo(makeRandomNumber(-100, 100), a), [
    _cx,
    _cy,
  ]);
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const $el = makeMockRect({ transform });
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );
  return { angle, cx, cy, index, $el };
};

export default ({ describe, it }) => [
  describe(`$$LiveRotateTransform`, function () {
    it(`The $$create static method make a new instance with the input values.`, function () {
      const { $el, index, angle, cx, cy } = setupMock();

      const live_rotate_transform = $$LiveRotateTransform.$$create({
        index,
        angle,
        cx,
        cy,
      })($el);

      expect(live_rotate_transform).instanceof($$LiveRotateTransform);
      expect($$isRotateSVGTransform(live_rotate_transform.transform)).true;
      expect(
        $$isRotateSVGTransform($$getBaseTransformList($el).getItem(index + 1))
      ).true;
      expect(live_rotate_transform.transform).deep.equal(
        $$getBaseTransformList($el).getItem(index + 1)
      );
      expect(live_rotate_transform.transform).deep.equal(
        $$createSVGTransformRotate({ angle, cx: 0, cy: 0 })()
      );
    });

    it(`The "$$update" method updates the transform's angle value.`, function () {
      const { $el, index, angle, cx, cy } = setupMock();
      const live_rotate_transform = $$LiveRotateTransform.$$create({
        index,
        angle,
        cx,
        cy,
      })($el);
      const new_angle = makeRandomNumber(-700, 700);

      live_rotate_transform.$$update({ angle: new_angle });

      expect(live_rotate_transform.transform).deep.equal(
        $$createSVGTransformRotate({ angle: new_angle, cx: 0, cy: 0 })()
      );
    });

    it(`The "$$append" method adds the input angle value to the transform.`, function () {
      const { $el, index, angle: angle1, cx, cy } = setupMock({
        angle: makeRandomInt(-700, 700),
      });
      const live_rotate_transform = $$LiveRotateTransform.$$create({
        index,
        angle: angle1,
        cx,
        cy,
      })($el);
      const angle2 = makeRandomInt(-700, 700);

      live_rotate_transform.$$append({ angle: angle2 });

      expect(live_rotate_transform.transform).deep.equal(
        $$createSVGTransformRotate({ angle: angle1 + angle2, cx: 0, cy: 0 })()
      );
    });

    it(`The "$$merge" methods merge the three transforms to the one rotate transform.`, function () {
      const { $el, index, angle, cx, cy } = setupMock();
      const live_rotate_transform = $$LiveRotateTransform.$$create({
        index,
        angle,
        cx,
        cy,
      })($el);
      const { numberOfItems: l1 } = $$getBaseTransformList($el);
      const transform = $$createSVGTransformRotate({ angle, cx, cy })();

      live_rotate_transform.$$merge();

      const { numberOfItems: l2 } = $$getBaseTransformList($el);
      expect(l2).equal(l1 - 2);
      expect($$getBaseTransformList($el).getItem(index)).deep.equal(transform);
    });
  }),
];
