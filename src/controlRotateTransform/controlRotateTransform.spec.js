import { expect } from "chai";
import {
  defaultTo,
  each,
  equals2,
  go,
  isUndefined,
  map,
  mapL,
  rangeL,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$controlRotateTransform } from "./controlRotateTransform.index.js";

const setupMock = ({
  angle: _angle,
  cx: _cx,
  cy: _cy,
  index: _index,
  transform: _transform,
} = {}) => {
  const angle = defaultTo(makeRandomInt(-700, 700), _angle);
  const [cx, cy] = mapL(defaultTo(makeRandomInt(-100, 100)), [_cx, _cy]);
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
  describe(`$$controlRotateTransform`, function () {
    it(`The return object has "update", "append", "end" methods.`, function () {
      const { angle, cx, cy, index, $el } = setupMock();

      const controller = $$controlRotateTransform({ angle, cx, cy, index })(
        $el
      );

      const entries = new Map(Object.entries(controller));
      expect(entries.size).equal(3);
      each(
        (k) => {
          expect(entries.has(k)).true;
          expect(entries.get(k)).a("function");
        },
        ["update", "append", "end"]
      );
    });

    it(`The function initiates rotate transform to the input element with the input angle, cx, cy, index.`, function () {
      const { angle, cx, cy, index, $el } = setupMock();

      $$controlRotateTransform({ angle, cx, cy, index })($el);

      const transform_list = $$getBaseTransformList($el);
      const [
        positive_translate_transform,
        rotate_transform,
        negative_translate_transform,
      ] = go(
        rangeL(3),
        mapL((i) => index + i),
        mapL((i) => transform_list.getItem(i))
      );
      expectSameValueSVGTransform(
        positive_translate_transform,
        $$createSVGTransformTranslate({ tx: cx, ty: cy })()
      );
      expectSameValueSVGTransform(
        rotate_transform,
        $$createSVGTransformRotate({ angle, cx: 0, cy: 0 })()
      );
      expectSameValueSVGTransform(
        negative_translate_transform,
        $$createSVGTransformTranslate({ tx: -cx, ty: -cy })()
      );
    });

    it(`The controller.update method update the transform with the input angle.`, function () {
      const { angle, cx, cy, index, $el } = setupMock();

      const controller = $$controlRotateTransform({
        angle,
        cx,
        cy,
        index,
      })($el);
      const receive_transform = $$getBaseTransformList($el).getItem(index + 1);
      const update_angle = makeRandomInt(-700, 700);

      controller.update({ angle: update_angle });

      const expect_transform = $$createSVGTransformRotate({
        angle: update_angle,
        cx: 0,
        cy: 0,
      })();
      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.append method add the input angle to the transform.`, function () {
      const { angle: angle1, cx, cy, index, $el } = setupMock();

      const controller = $$controlRotateTransform({
        angle: angle1,
        cx,
        cy,
        index,
      })($el);
      const receive_transform = $$getBaseTransformList($el).getItem(index + 1);
      const angle2 = makeRandomInt(-700, 700);

      controller.append({ angle: angle2 });

      const expect_transform = $$createSVGTransformRotate({
        angle: angle1 + angle2,
        cx: 0,
        cy: 0,
      })();
      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.end method merge the transforms from index to index + 2 to a rotate transform.`, function () {
      const { angle, cx, cy, index, $el } = setupMock();

      const controller = $$controlRotateTransform({
        angle,
        cx,
        cy,
        index,
      })($el);

      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );
      const rotate_transform = $$createSVGTransformRotate({ angle, cx, cy })();
      const expect_transform_list = go(
        before_transform_list,
        zipWithIndexL,
        rejectL(([i]) => i >= index + 1 && i <= index + 2),
        map(([i, transform]) =>
          equals2(i, index) ? rotate_transform : transform
        )
      );
      expect(after_transform_list.length).equal(expect_transform_list.length);
      const pairs = zipL(after_transform_list, expect_transform_list);
      for (const [receive_transform, expect_transform] of pairs) {
        expectSameValueSVGTransform(receive_transform, expect_transform);
      }
    });
  }),
];
