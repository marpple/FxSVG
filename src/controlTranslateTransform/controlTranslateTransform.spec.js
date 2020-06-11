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
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$controlTranslateTransform } from "./controlTranslateTransform.index.js";

const setupMock = ({
  x: _x,
  y: _y,
  tx: _tx,
  ty: _ty,
  transform: _transform,
  index: _index,
} = {}) => {
  const [x, y, tx, ty] = mapL(defaultTo(makeRandomInt()), [_x, _y, _tx, _ty]);
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

const compressSVGTransformListToMatrix = ({ tx, ty, index, transform_list }) =>
  go(
    [
      { tx, ty },
      { tx: -tx, ty: -ty },
    ],
    mapL($$createSVGTransformTranslate()),
    mapL(({ matrix: m }) => m),
    ([plus_t_m, minus_t_m]) =>
      go(
        transform_list,
        deepCopyTransformListToMatrixList,
        zipWithIndexL,
        rejectL(([i]) => equals2(i, index)),
        mapL(([, m]) => m),
        mapL((m) => plus_t_m.multiply(m).multiply(minus_t_m)),
        (iter) => reduce((m1, m2) => m1.multiply(m2), iter)
      )
  );

export default ({ describe, it }) => [
  describe(`$$controlTranslateTransform`, function () {
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

    it(`The return transform object is a translate transform whose matrix is represent the input tx, ty.`, function () {
      const {
        result: { transform },
        tx,
        ty,
      } = setupMock();

      expect($$isTranslateSVGTransform(transform)).to.be.true;
      expect(transform.matrix.e).to.equal(tx);
      expect(transform.matrix.f).to.equal(ty);
    });

    it(`The return transform object is the SVGTransform at [index] in SVGTransformList of $el.`, function () {
      const {
        result: { transform: t1 },
        $el,
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index);

      expect(t2).to.deep.equal(t1);
    });

    it(`The controller.update method update the return transform with the input tx, ty.`, function () {
      const {
        result: { $el, transform: t1, controller },
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index);

      const [tx, ty] = mapL(() => makeRandomInt(), rangeL(2));
      controller.update({ tx, ty });

      expect(t1.matrix.e).to.equal(tx);
      expect(t1.matrix.f).to.equal(ty);
      expect(t1).to.deep.equal(t2);
    });

    it(`The controller.append method add the input tx, ty to the return transform.`, function () {
      const {
        result: { $el, transform: t1, controller },
        index,
        tx: tx1,
        ty: ty1,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index);

      const [tx2, ty2] = mapL(() => makeRandomInt(), rangeL(2));
      controller.append({ tx: tx2, ty: ty2 });

      expect(t1.matrix.e).to.equal(tx1 + tx2);
      expect(t1.matrix.f).to.equal(ty1 + ty2);
      expect(t1).to.deep.equal(t2);
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

    it(`The controller.end method compress all SVGTransforms.`, function () {
      each(
        (transform) => {
          const {
            tx,
            ty,
            index,
            result: { $el, controller },
          } = setupMock({ transform });

          const compressed_m = compressSVGTransformListToMatrix({
            tx,
            ty,
            index,
            transform_list: $$getBaseTransformList($el),
          });

          controller.end();

          expect($$getBaseTransformList($el).numberOfItems).to.equal(
            transform ? 1 : 0
          );
          transform &&
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
            result: { controller, $el },
            x,
            y,
            tx: tx0,
            ty: ty0,
            index,
          } = setupMock({ transform });

          const list = go(
            rangeL(makeRandomInt()),
            mapL(makeRandomBool),
            mapL((a) => (a ? "append" : "update")),
            map((operation) => ({
              operation,
              tx: makeRandomInt(-100, 100),
              ty: makeRandomInt(-100, 100),
            }))
          );
          each(
            ({ operation, tx, ty }) => controller[operation]({ tx, ty }),
            list
          );

          const { tx, ty } = reduce(
            ({ tx: tx1, ty: ty1 }, { operation, tx: tx2, ty: ty2 }) =>
              operation === "update"
                ? { tx: tx2, ty: ty2 }
                : { tx: tx1 + tx2, ty: ty1 + ty2 },
            { tx: tx0, ty: ty0 },
            list
          );
          const compressed_m = compressSVGTransformListToMatrix({
            tx,
            ty,
            index,
            transform_list: $$getBaseTransformList($el),
          });

          controller.end();

          expect($el.getAttributeNS(null, "x")).to.equal(`${x + tx}`);
          expect($el.getAttributeNS(null, "y")).to.equal(`${y + ty}`);
          expect($$getBaseTransformList($el).numberOfItems).to.equal(
            transform ? 1 : 0
          );
          transform &&
            expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
              compressed_m
            );
        },
        [null, makeRandomTransformAttributeValue(1)]
      );
    });
  }),
];
