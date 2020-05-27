import { expect } from "chai";
import {
  makeRandomInt,
  makeRandomNumber,
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

const expectSameTransformList = (l1, l2) => {
  expect(l1.length).to.equal(l2.length);
  for (let i = 0; i < l1.length; i++) {
    const t1 = l1[0];
    const t2 = l2[0];
    expect(t1).to.deep.equal(t2);
  }
};

const expectSameTransformsAfterMerge = ($el) => {
  const before_list = [...$$getBaseTransformList($el)];

  const result = $$mergeTranslateTransform()($el, {
    x_name: "x",
    y_name: "y",
  });

  const after_list = [...$$getBaseTransformList($el)];

  expect(result).to.equal($el);
  expectSameTransformList(after_list, before_list);
};

describe(`$$mergeTranslateTransform`, function () {
  let $el;
  let x;
  let y;

  beforeEach(function () {
    x = makeRandomInt();
    y = makeRandomInt();

    const transform_str = makeRandomTransformAttributeValue();
    $el = $$el()(`
      <rect
        x="${x}"
        y="${y}"
        width="${Math.abs(makeRandomNumber())}"
        height="${Math.abs(makeRandomNumber())}"
        ${transform_str ? `transform="${transform_str}"` : ""}
      >
      </rect> 
    `);
  });

  describe(`
  If the first SVGTransform is not a translate SVGTransform,
  the function do nothing but return the element.
  `, function () {
    it(`Use a matrix transform.`, function () {
      $$getBaseTransformList($el).insertItemBefore(
        $$createSVGTransformMatrix()(
          $$createSVGMatrix()(
            ["a", "b", "c", "d", "e", "f"]
              .map((k) => [k, makeRandomNumber()])
              .reduce((acc, [k, v]) => {
                acc[k] = v;
                return acc;
              }, {})
          )
        ),
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
    const before_l = [...$$getBaseTransformList($el)];

    const t = $$createSVGTransformTranslate()({
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });
    $$getBaseTransformList($el).insertItemBefore(t, 0);

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    const after_l = [...$$getBaseTransformList($el)];

    expectSameTransformList(after_l, before_l);
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
    const before_list = [...$$getBaseTransformList($el)]
      .map(({ matrix: m }) => m)
      .map(({ a, b, c, d, e, f }) => ({ a, b, c, d, e, f }))
      .map($$createSVGMatrix());

    const tx = makeRandomInt();
    const ty = makeRandomInt();
    const t = $$createSVGTransformTranslate()({ tx, ty });
    $$getBaseTransformList($el).insertItemBefore(t, 0);
    const m1 = $$createSVGMatrix()({ e: tx, f: ty });
    const m2 = $$createSVGMatrix()({ e: -tx, f: -ty });

    $$mergeTranslateTransform()($el, { x_name: "x", y_name: "y" });

    const after_list = [...$$getBaseTransformList($el)]
      .map(({ matrix: m }) => m)
      .map(({ a, b, c, d, e, f }) => ({ a, b, c, d, e, f }))
      .map($$createSVGMatrix());

    expect(after_list.length).to.equal(before_list.length);
    for (let i = 0; i < after_list.length; i++) {
      const before_m = before_list[i];
      const after_m = after_list[i];

      expect(after_m).to.deep.equal(m1.multiply(before_m).multiply(m2));
    }
  });
});
