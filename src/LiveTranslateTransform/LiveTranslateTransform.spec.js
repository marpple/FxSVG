import chai from "chai";
import { defaultTo, isUndefined, mapL, rangeL } from "fxjs";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$LiveTranslateTransform } from "./LiveTranslateTransform.index.js";

const { expect } = chai;

const setupMock = ({
  x: _x,
  y: _y,
  tx: _tx,
  ty: _ty,
  transform: _transform,
  index: _index,
} = {}) => {
  const [x, y, tx, ty] = mapL(
    (a) => defaultTo(makeRandomNumber(-100, 100), a),
    [_x, _y, _tx, _ty]
  );
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const $el = makeMockRect({ x, y, transform });
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );
  return { tx, ty, index, $el, x_name: "x", y_name: "y" };
};

export default ({ describe, it }) => [
  describe(`$$LiveTranslateTransform`, function () {
    it(`The $$create static method make a new instance with the input values.`, function () {
      const { tx, ty, x_name, y_name, index, $el } = setupMock();

      const live_translate_transform = $$LiveTranslateTransform.$$create({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);

      expect(live_translate_transform).instanceof($$LiveTranslateTransform);
      expect($$isTranslateSVGTransform(live_translate_transform.transform))
        .true;
      expect(
        $$isTranslateSVGTransform($$getBaseTransformList($el).getItem(index))
      ).true;
      expect(live_translate_transform.transform).deep.equal(
        $$getBaseTransformList($el).getItem(index)
      );
      expect(live_translate_transform.transform).deep.equal(
        $$createSVGTransformTranslate({ tx, ty })()
      );
    });

    it(`The "$$update" method updates the transform's tx, ty values.`, function () {
      const { tx, ty, x_name, y_name, index, $el } = setupMock();
      const live_translate_transform = $$LiveTranslateTransform.$$create({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);
      const [new_tx, new_ty] = mapL(
        () => makeRandomNumber(-100, 100),
        rangeL(2)
      );

      live_translate_transform.$$update({ tx: new_tx, ty: new_ty });

      expect(live_translate_transform.transform).deep.equal(
        $$createSVGTransformTranslate({ tx: new_tx, ty: new_ty })()
      );
    });

    it(`The "$$append" method adds the input tx, ty values to the transform.`, function () {
      const { tx: tx1, ty: ty1, x_name, y_name, index, $el } = setupMock({
        tx: makeRandomInt(-100, 100),
        ty: makeRandomInt(-100, 100),
      });
      const live_translate_transform = $$LiveTranslateTransform.$$create({
        index,
        tx: tx1,
        ty: ty1,
        x_name,
        y_name,
      })($el);
      const [tx2, ty2] = mapL(() => makeRandomInt(-100, 100), rangeL(2));

      live_translate_transform.$$append({ tx: tx2, ty: ty2 });

      expect(live_translate_transform.transform).deep.equal(
        $$createSVGTransformTranslate({ tx: tx1 + tx2, ty: ty1 + ty2 })()
      );
    });

    it(`The "$$merge" methods merge the transform's tx, ty to the element's x, y if there are x_name, y_name.`, function () {
      const [tx, ty, x1, y1] = mapL(() => makeRandomInt(-100, 100), rangeL(4));
      const { x_name, y_name, index, $el } = setupMock({
        tx,
        ty,
        x: x1,
        y: y1,
      });
      const live_translate_transform = $$LiveTranslateTransform.$$create({
        index,
        tx,
        ty,
        x_name,
        y_name,
      })($el);
      const { numberOfItems: l1 } = $$getBaseTransformList($el);

      live_translate_transform.$$merge();

      const { numberOfItems: l2 } = $$getBaseTransformList($el);
      const [x2, y2] = mapL((k) => parseFloat($$getAttrNS(k)($el)), [
        x_name,
        y_name,
      ]);
      expect(l2).equal(l1 - 1);
      expect(x2).equal(x1 + tx);
      expect(y2).equal(y1 + ty);
    });
  }),
];
