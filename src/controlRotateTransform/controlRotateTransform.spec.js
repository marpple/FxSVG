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
  reduce,
  rejectL,
  zipWithIndexL,
} from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeMockRect,
  makeRandomBool,
  makeRandomInt,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
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

const compressSVGTransformListToMatrix = ({
  transform_list,
  index,
  angle,
  cx,
  cy,
}) =>
  go(
    transform_list,
    deepCopyTransformListToMatrixList,
    zipWithIndexL,
    rejectL(([i]) => equals2(i, index) || equals2(i, index + 2)),
    mapL(([i, m]) =>
      equals2(i, index + 1)
        ? $$createSVGTransformRotate()({ angle, cx, cy }).matrix
        : m
    ),
    reduce((m1, m2) => m1.multiply(m2))
  );

export default ({ describe, it }) => [
  describe(`$$controlRotateTransform`, function () {
    it(`The return object has $el, controller, transform properties.`, function () {
      const { result } = setupMock();

      const keys = new Set(Object.keys(result));

      expect(keys.size).to.equal(3);
      each((k) => expect(keys.has(k)).to.be.true, [
        "$el",
        "controller",
        "transform",
      ]);
    });

    it(`The return $el is same with the input $el.`, function () {
      const {
        result: { $el: $el1 },
        $el: $el2,
      } = setupMock();

      expect($el1).to.equal($el2);
    });

    it(`The return controller object has update, append, end methods.`, function () {
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

    it(`The return transform object is a rotate transform whose angle is the input angle.`, function () {
      const {
        result: { transform },
        angle,
      } = setupMock();

      expect($$isRotateSVGTransform(transform)).to.be.true;
      expect(transform.angle).to.equal(angle);
    });

    it(`The return transform object is the SVGTransform at [index + 1] in SVGTransformList of $el.`, function () {
      const {
        result: { transform: t1 },
        $el,
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index + 1);

      expect(t2).to.deep.equal(t1);
    });

    it(`The controller.update method update the return transform with the input angle.`, function () {
      const {
        result: { $el, transform: t1, controller },
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index + 1);

      const angle = makeRandomInt(-700, 700);
      controller.update({ angle });

      expect(t1.angle).to.equal(angle);
      expect(t1).to.deep.equal(t2);
    });

    it(`The controller.append method add the input angle to the return transform.`, function () {
      const {
        result: { $el, transform: t1, controller },
        index,
        angle: angle1,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index + 1);

      const angle2 = makeRandomInt(-700, 700);
      controller.append({ angle: angle2 });

      expect(t1.angle).to.equal(angle1 + angle2);
      expect(t1).to.deep.equal(t2);
    });

    it(`The controller.end method merge the all transforms of the element.`, function () {
      each(
        (transform) => {
          const {
            cx,
            cy,
            angle,
            index,
            result: { $el, controller },
          } = setupMock({ transform });

          const compressed_m = compressSVGTransformListToMatrix({
            index,
            angle,
            cx,
            cy,
            transform_list: $$getBaseTransformList($el),
          });

          controller.end();

          expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
          expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
            compressed_m
          );
        },
        [null, makeRandomTransformAttributeValue(1)]
      );
    });

    it(`Arbitrary use case test.`, function () {
      each(
        (transform) => {
          const {
            cx,
            cy,
            angle: angle0,
            index,
            result: { $el, controller },
          } = setupMock({ transform });

          const list = go(
            rangeL(makeRandomInt()),
            mapL(makeRandomBool),
            mapL((a) => (a ? "append" : "update")),
            map((operation) => ({ operation, angle: makeRandomInt(-700, 700) }))
          );
          each(
            ({ operation, angle }) => controller[operation]({ angle }),
            list
          );

          const { angle } = reduce(
            ({ angle: angle1 }, { operation, angle: angle2 }) =>
              operation === "update"
                ? { angle: angle2 }
                : { angle: angle1 + angle2 },
            { angle: angle0 },
            list
          );
          const compressed_m = compressSVGTransformListToMatrix({
            index,
            angle,
            cx,
            cy,
            transform_list: $$getBaseTransformList($el),
          });

          controller.end();

          expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
          expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
            compressed_m
          );
        },
        [null, makeRandomTransformAttributeValue(1)]
      );
    });
  }),
];
