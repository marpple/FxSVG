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
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$controlTranslateTransform } from "./controlTranslateTransform.index.js";

const setupMock = ({
  x: _x,
  y: _y,
  tx: _tx,
  ty: _ty,
  transform: _transform,
  index: _index,
} = {}) => {
  const [x, y, tx, ty] = mapL(defaultTo(makeRandomInt(-100, 100)), [
    _x,
    _y,
    _tx,
    _ty,
  ]);
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const $el = makeMockRect({ x, y, transform });
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );
  const result = $$controlTranslateTransform()($el, {
    tx,
    ty,
    x_name: "x",
    y_name: "y",
    index,
  });
  return { x, y, tx, ty, index, $el, result };
};

export default ({ describe, it }) => [
  describe(`$$controlTranslateTransform`, function () {
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

    it(`The return transform object is a translate transform whose tx, ty are the input tx, ty.`, function () {
      const {
        result: { transform: receive_transform },
        tx,
        ty,
      } = setupMock();

      const expect_transform = $$createSVGTransformTranslate()({ tx, ty });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The return transform object is the transform at the input index.`, function () {
      const {
        result: { transform: receive_transform },
        $el,
        index,
      } = setupMock();
      const expect_transform = $$getBaseTransformList($el).getItem(index);

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.update method update the return transform with the input tx, ty.`, function () {
      const {
        result: { transform: receive_transform, controller },
      } = setupMock();

      const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
      controller.update({ tx, ty });

      const expect_transform = $$createSVGTransformTranslate()({ tx, ty });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.append method add the input tx, ty to the return transform.`, function () {
      const {
        result: { transform: receive_transform, controller },
        tx: tx1,
        ty: ty1,
      } = setupMock();

      const [tx2, ty2] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
      controller.append({ tx: tx2, ty: ty2 });

      const expect_transform = $$createSVGTransformTranslate()({
        tx: tx1 + tx2,
        ty: ty1 + ty2,
      });

      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.end method update x, y of the element.`, function () {
      const {
        result: { $el, controller },
        x,
        y,
        tx,
        ty,
      } = setupMock();

      controller.end();

      expect($el.getAttributeNS(null, "x")).to.equal(`${x + tx}`);
      expect($el.getAttributeNS(null, "y")).to.equal(`${y + ty}`);
    });

    it(`The controller.end method remove the translate transform.`, function () {
      const {
        result: { $el, controller },
        index,
        tx,
        ty,
      } = setupMock();
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      expect(after_transform_list.length).equal(
        before_transform_list.length - 1
      );
      go(
        [
          { tx, ty },
          { tx: -tx, ty: -ty },
        ],
        mapL($$createSVGTransformTranslate()),
        mapL(({ matrix: m }) => m),
        ([plus_matrix, minus_matrix]) =>
          go(
            before_transform_list,
            zipWithIndexL,
            rejectL(([i]) => equals2(i, index)),
            mapL(([, transform]) => transform),
            mapL(({ matrix }) =>
              $$createSVGTransformMatrix({
                matrix: plus_matrix.multiply(matrix).multiply(minus_matrix),
              })()
            ),
            zipL(after_transform_list)
          ),
        each(([after_transform, before_transform]) =>
          expectSameValueSVGTransform(after_transform, before_transform)
        )
      );
    });
  }),
];
