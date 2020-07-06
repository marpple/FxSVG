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
  const [x, y, tx, ty] = mapL((a) => defaultTo(makeRandomInt(-100, 100), a), [
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
  return { x, y, tx, ty, index, $el, x_name: "x", y_name: "y" };
};

export default ({ describe, it }) => [
  describe(`$$controlTranslateTransform`, function () {
    it(`The return object has "update", "append", "end" methods.`, function () {
      const { tx, ty, x_name, y_name, index, $el } = setupMock();

      const controller = $$controlTranslateTransform({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);

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

    it(`The function initiates a translate transform to the input element with the input tx, ty, index.`, function () {
      const { $el, index, x_name, y_name, tx, ty } = setupMock();

      $$controlTranslateTransform({ index, tx, ty, x_name, y_name })($el);

      const translate_transform = $$getBaseTransformList($el).getItem(index);
      expectSameValueSVGTransform(
        translate_transform,
        $$createSVGTransformTranslate({ tx, ty })()
      );
    });

    it(`The controller.update method update the transform with the input tx, ty.`, function () {
      const { $el, index, x_name, y_name, tx, ty } = setupMock();
      const controller = $$controlTranslateTransform({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);
      const receive_transform = $$getBaseTransformList($el).getItem(index);
      const [update_tx, update_ty] = mapL(
        () => makeRandomInt(-100, 100),
        rangeL(2)
      );

      controller.update({ tx: update_tx, ty: update_ty });

      const expect_transform = $$createSVGTransformTranslate({
        tx: update_tx,
        ty: update_ty,
      })();
      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.append method add the input tx, ty to the transform.`, function () {
      const { x_name, y_name, index, tx: tx1, ty: ty1, $el } = setupMock();
      const controller = $$controlTranslateTransform({
        index,
        tx: tx1,
        ty: ty1,
        x_name,
        y_name,
      })($el);
      const receive_transform = $$getBaseTransformList($el).getItem(index);
      const [tx2, ty2] = mapL(() => makeRandomInt(-100, 100), rangeL(2));

      controller.append({ tx: tx2, ty: ty2 });

      const expect_transform = $$createSVGTransformTranslate({
        tx: tx1 + tx2,
        ty: ty1 + ty2,
      })();
      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.end method update x, y of the element if there are x_name and y_name.`, function () {
      const { index, $el, x, y, tx, ty, x_name, y_name } = setupMock();
      const controller = $$controlTranslateTransform({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);

      controller.end();

      expect($el.getAttributeNS(null, "x")).equal(`${x + tx}`);
      expect($el.getAttributeNS(null, "y")).equal(`${y + ty}`);
    });

    it(`The controller.end method do nothing to the element and the transform list
        if there is no x_name or y_name.`, function () {
      const cases = [
        [true, false],
        [false, true],
        [false, false],
      ];
      for (const [is_x_name, is_y_name] of cases) {
        const { index, $el, tx, ty, x_name, y_name } = setupMock();
        const controller = $$controlTranslateTransform({
          index,
          tx,
          ty,
          x_name: is_x_name ? x_name : undefined,
          y_name: is_y_name ? y_name : undefined,
        })($el);
        const $before = $el.cloneNode(true);
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        controller.end();

        const $after = $el.cloneNode(true);
        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect($after).deep.equal($before);
        expect(after_transform_list.length).equal(before_transform_list.length);
        const pairs = zipL(after_transform_list, before_transform_list);
        for (const [receive_transform, expect_transform] of pairs) {
          expectSameValueSVGTransform(receive_transform, expect_transform);
        }
      }
    });

    it(`The controller.end method remove the translate transform if there are x_name and y_name.`, function () {
      const { index, tx, ty, x_name, y_name, $el } = setupMock();
      const controller = $$controlTranslateTransform({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);
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
      const [positive_translate_matrix, negative_translate_matrix] = go(
        [
          { tx, ty },
          { tx: -tx, ty: -ty },
        ],
        mapL((values) => $$createSVGTransformTranslate(values)()),
        mapL(({ matrix: m }) => m)
      );
      const pairs = go(
        before_transform_list,
        zipWithIndexL,
        rejectL(([i]) => equals2(i, index)),
        mapL(([, transform]) => transform),
        mapL(({ matrix }) =>
          $$createSVGTransformMatrix({
            matrix: positive_translate_matrix
              .multiply(matrix)
              .multiply(negative_translate_matrix),
          })()
        ),
        zipL(after_transform_list)
      );
      for (const [receive_transform, expect_transform] of pairs) {
        expectSameValueSVGTransform(receive_transform, expect_transform);
      }
    });
  }),
];
