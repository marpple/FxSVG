import { expect } from "chai";
import { dropL, each, go, map, mapL, rangeL, reduce } from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$controlTranslateTransform } from "./controlTranslateTransform.index.js";

export default () => [
  describe(`$$controlTranslateTransform`, function () {
    let x;
    let y;
    let init_tx;
    let init_ty;
    let $el;
    let result;

    beforeEach(function () {
      x = makeRandomInt();
      y = makeRandomInt();
      $el = $$el()(`
      <rect
        x="${x}"
        y="${y}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        transform="${makeRandomTransformAttributeValue(1)}"
      >
      </rect> 
    `);

      init_tx = makeRandomInt();
      init_ty = makeRandomInt();
      result = $$controlTranslateTransform()($el, {
        tx: init_tx,
        ty: init_ty,
        x_name: "x",
        y_name: "y",
      });
    });

    it(`The return object has $el, controller, transform properties.`, function () {
      expect(result).to.have.property("$el");
      expect(result).to.have.property("controller");
      expect(result).to.have.property("transform");
    });

    it(`The return $el is same with the input $el.`, function () {
      const { $el: $result_el } = result;

      expect($result_el).to.equal($el);
    });

    it(`The return controller object has update, append, end methods.`, function () {
      const { controller } = result;

      expect(controller).to.have.property("update");
      expect(controller.update).is.a("function");
      expect(controller).to.have.property("append");
      expect(controller.append).is.a("function");
      expect(controller).to.have.property("end");
      expect(controller.end).is.a("function");
    });

    it(`
  The return transform object is a translate transform
  whose matrix is represent the input tx, ty.
  `, function () {
      const { transform } = result;

      expect($$isTranslateSVGTransform(transform)).to.be.true;
      expect(transform.matrix.e).to.equal(init_tx);
      expect(transform.matrix.f).to.equal(init_ty);
    });

    it(`
  The return transform object is the SVGTransform at 0 index in SVGTransformList of $el.
  `, function () {
      const { $el, transform } = result;
      const l = $$getBaseTransformList($el);

      expect(l.getItem(0)).to.deep.equal(transform);
    });

    it(`
  The controller.update method update the return transform with the input tx, ty.
  `, function () {
      const { $el, transform, controller } = result;

      const tx = makeRandomInt();
      const ty = makeRandomInt();

      controller.update({ tx, ty });

      expect(transform.matrix.e).to.equal(tx);
      expect(transform.matrix.f).to.equal(ty);
      expect(transform).to.deep.equal($$getBaseTransformList($el).getItem(0));
    });

    it(`
  The controller.append method add the input tx, ty to the return transform. 
  `, function () {
      const { $el, transform, controller } = result;

      const tx = makeRandomInt();
      const ty = makeRandomInt();

      controller.append({ tx, ty });

      expect(transform.matrix.e).to.equal(init_tx + tx);
      expect(transform.matrix.f).to.equal(init_ty + ty);
      expect(transform).to.deep.equal($$getBaseTransformList($el).getItem(0));
    });

    it(`
  The controller.end method update x, y of the element. 
  `, function () {
      const { $el, controller } = result;

      controller.end();

      expect($el.getAttributeNS(null, "x")).to.equal(`${x + init_tx}`);
      expect($el.getAttributeNS(null, "y")).to.equal(`${y + init_ty}`);
    });

    it(`
  The controller.end method compress all SVGTransforms except the created one by the first function call.
  Every other SVGTransforms are applied [-translate] then [+translate] transform.
  `, function () {
      const { $el, controller } = result;
      const [plus_t_m, minus_t_m] = go(
        [
          { tx: init_tx, ty: init_ty },
          { tx: -init_tx, ty: -init_ty },
        ],
        mapL($$createSVGTransformTranslate()),
        mapL(({ matrix: m }) => m)
      );
      const compressed_m = go(
        $el,
        $$getBaseTransformList,
        deepCopyTransformListToMatrixList,
        dropL(1),
        mapL((m) => plus_t_m.multiply(m).multiply(minus_t_m)),
        (iter) =>
          reduce((m1, m2) => m1.multiply(m2), $$createSVGMatrix()(), iter)
      );

      controller.end();

      expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
      expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
        compressed_m
      );
    });

    it(`Arbitrary use case test.`, function () {
      const { controller, $el } = result;
      const list = go(
        rangeL(makeRandomInt()),
        mapL(makeRandomBool),
        mapL((a) => (a ? "append" : "update")),
        map((operation) => ({
          operation,
          tx: makeRandomInt(),
          ty: makeRandomInt(),
        }))
      );
      const { tx, ty } = reduce(
        ({ tx: tx1, ty: ty1 }, { operation, tx: tx2, ty: ty2 }) =>
          operation === "update"
            ? { tx: tx2, ty: ty2 }
            : { tx: tx1 + tx2, ty: ty1 + ty2 },
        {
          tx: init_tx,
          ty: init_ty,
        },
        list
      );
      each(({ operation, tx, ty }) => controller[operation]({ tx, ty }), list);
      const [plus_t_m, minus_t_m] = go(
        [
          { tx, ty },
          { tx: -tx, ty: -ty },
        ],
        mapL($$createSVGTransformTranslate()),
        mapL(({ matrix: m }) => m)
      );
      const compressed_m = go(
        $el,
        $$getBaseTransformList,
        deepCopyTransformListToMatrixList,
        dropL(1),
        mapL((matrix) => plus_t_m.multiply(matrix).multiply(minus_t_m)),
        (iter) =>
          reduce((m1, m2) => m1.multiply(m2), $$createSVGMatrix()(), iter)
      );

      controller.end();

      expect($el.getAttributeNS(null, "x")).to.equal(`${x + tx}`);
      expect($el.getAttributeNS(null, "y")).to.equal(`${y + ty}`);
      expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
      expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
        compressed_m
      );
    });
  }),
];
