import { expect } from "chai";
import {
  defaultTo,
  each,
  equals2,
  go,
  isUndefined,
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
  const [cx, cy] = mapL(defaultTo(makeRandomInt(-100, 100)), rangeL(2));
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const $el = makeMockRect({ transform });
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );
  const result = $$controlRotateTransform()($el, { angle, cx, cy, index });
  return { angle, cx, cy, index, $el, result };
};

export default ({ describe, it }) => [
  describe(`$$controlRotateTransform`, function () {
    it(`The return object has "$el", "controller", "transform" properties.`, function () {
      const { result } = setupMock();

      const keys = new Set(Object.keys(result));

      expect(keys.size).to.equal(3);
      each((k) => expect(keys.has(k)).to.be.true, [
        "$el",
        "controller",
        "transform",
      ]);
    });

    it(`The return element is same with the input element.`, function () {
      const {
        result: { $el: $receive },
        $el: $expect,
      } = setupMock();

      expect($receive).to.equal($expect);
    });

    it(`The return controller object has "update", "append", "end" methods.`, function () {
      const {
        result: { controller },
      } = setupMock();

      const entries = new Map(Object.entries(controller));

      expect(entries.size).to.equal(3);
      each(
        (k) => {
          expect(entries.has(k)).to.be.true;
          expect(entries.get(k)).is.a("function");
        },
        ["update", "append", "end"]
      );
    });

    it(`The return transform object is a rotate transform whose angle is the input angle and cx, cy are 0.`, function () {
      const {
        result: { transform: receive_transform },
        angle,
      } = setupMock();

      const expect_transform = $$createSVGTransformRotate()({
        angle,
        cx: 0,
        cy: 0,
      });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The return transform object is the transform at the input index + 1.`, function () {
      const {
        result: { transform: receive_transform },
        $el,
        index,
      } = setupMock();
      const expect_transform = $$getBaseTransformList($el).getItem(index + 1);

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.update method update the return transform with the input angle.`, function () {
      const {
        result: { transform: receive_transform, controller },
      } = setupMock();

      const angle = makeRandomInt(-700, 700);
      controller.update({ angle });

      const expect_transform = $$createSVGTransformRotate()({
        angle,
        cx: 0,
        cy: 0,
      });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.append method add the input angle to the return transform.`, function () {
      const {
        result: { transform: receive_transform, controller },
        angle: angle1,
      } = setupMock();

      const angle2 = makeRandomInt(-700, 700);
      controller.append({ angle: angle2 });

      const expect_transform = $$createSVGTransformRotate()({
        angle: angle1 + angle2,
        cx: 0,
        cy: 0,
      });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.end method merge the transforms from index to index + 2 to a rotate transform.`, function () {
      const {
        result: { $el, controller },
        index,
        angle,
        cx,
        cy,
      } = setupMock();
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      expect(after_transform_list.length).equal(
        before_transform_list.length - 2
      );
      go(
        $$createSVGTransformRotate()({ angle, cx, cy }),
        (rotate_transform) =>
          go(
            before_transform_list,
            zipWithIndexL,
            rejectL(([i]) => i >= index + 1 && i <= index + 2),
            mapL(([i, transform]) =>
              equals2(i, index) ? rotate_transform : transform
            ),
            mapL(({ type, matrix }) => ({ type, matrix }))
          ),
        zipL(after_transform_list),
        each(([after_transform, before_transform]) =>
          expectSameValueSVGTransform(after_transform, before_transform)
        )
      );
    });
  }),
];
