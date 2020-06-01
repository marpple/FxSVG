import { expect } from "chai";
import { go1 } from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$mergeTranslateTransform } from "./mergeTranslateTransform.index.js";

const expectSameTransformsAfterMerge = ($el) => {
  const before_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );

  const result = $$mergeTranslateTransform()($el, {
    x_name: "x",
    y_name: "y",
  });

  const after_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );

  expect(result).to.equal($el);
  expect(after_list).to.deep.equal(before_list);
};

describe(`$$mergeTranslateTransform`, function () {
  let $el;
  let x;
  let y;

  beforeEach(function () {
    x = makeRandomInt();
    y = makeRandomInt();

    $el = $$el()(`
      <rect
        x="${x}"
        y="${y}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        ${go1(makeRandomTransformAttributeValue(), (t) =>
          t ? `transform="${t}"` : ""
        )}
      >
      </rect> 
    `);
  });

  describe(`
  If the first SVGTransform is not a translate SVGTransform,
  the function do nothing but return the element.
  `, function () {
    it(`The element have no SVGTransform.`, function () {
      $el.removeAttributeNS(null, "transform");

      expectSameTransformsAfterMerge($el);
    });

    it(`Use a matrix transform.`, function () {
      $$getBaseTransformList($el).insertItemBefore(
        $$createSVGTransformMatrix()(makeRandomSVGMatrix()),
        0
      );

      expectSameTransformsAfterMerge($el);
    });

    it(`Use a rotate transform.`, function () {
      $$getBaseTransformList($el).insertItemBefore(
        $$createSVGTransformRotate()({
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
        }),
        0
      );

      expectSameTransformsAfterMerge($el);
    });

    it(`Use a scale transform.`, function () {
      $$getBaseTransformList($el).insertItemBefore(
        $$createSVGTransformScale()({
          sx: makeRandomNumber(),
          sy: makeRandomNumber(),
        }),
        0
      );

      expectSameTransformsAfterMerge($el);
    });
  });

  it(`
  If the SVGTransform is merged, the SVGTransform will be removed from the element's SVGTransformList. 
  `, function () {
    const t = $$createSVGTransformTranslate()({
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });
    $$getBaseTransformList($el).insertItemBefore(t, 0);
    const { numberOfItems: before_n } = $$getBaseTransformList($el);

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    const { numberOfItems: after_n } = $$getBaseTransformList($el);
    expect(after_n).to.equal(before_n - 1);
  });

  it(`The element's x value will be added by SVGTransform's tx value.`, function () {
    const tx = makeRandomInt();
    const t = $$createSVGTransformTranslate()({ tx, ty: makeRandomNumber() });
    $$getBaseTransformList($el).insertItemBefore(t, 0);

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    expect($el.getAttributeNS(null, "x")).to.equal(`${x + tx}`);
  });

  it(`The element's y value will be added by SVGTransform's ty value.`, function () {
    const ty = makeRandomInt();
    const t = $$createSVGTransformTranslate()({ tx: makeRandomNumber(), ty });
    $$getBaseTransformList($el).insertItemBefore(t, 0);

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    expect($el.getAttributeNS(null, "y")).to.equal(`${y + ty}`);
  });

  it(`
  Other SVGTransforms will be changed by the following formula. 
  [after SVGTransform matrix = translate(tx, ty) matrix * before SVGTransform matrix * translate(-tx, -ty) matrix]
  `, function () {
    const before_list = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );

    const tx = makeRandomInt();
    const ty = makeRandomInt();
    const t = $$createSVGTransformTranslate()({ tx, ty });
    $$getBaseTransformList($el).insertItemBefore(t, 0);
    const m1 = $$createSVGMatrix()({ e: tx, f: ty });
    const m2 = $$createSVGMatrix()({ e: -tx, f: -ty });

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    const after_list = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );
    expect(after_list).to.deep.equal(
      before_list.map((m) => m1.multiply(m).multiply(m2))
    );
  });
});
