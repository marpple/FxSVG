import { expect } from "chai";
import { appendL, each, equals2, go, go1, mapL, object, rangeL } from "fxjs2";
import {
  makeRandomTransformAttributeValue,
  makeRandomNumber,
  deepCopyTransformListToMatrixList,
  makeAllCombinations,
  makeRandomInt,
} from "../../test/utils/index.js";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$initScaleTransform } from "./initScaleTransform.index.js";

const createMockEl = () =>
  $$el()(`
    <rect
      x="${makeRandomNumber()}"
      y="${makeRandomNumber()}"
      width="${makeRandomNumber(1)}"
      height="${makeRandomNumber(1)}"
      ${go1(makeRandomTransformAttributeValue(), (t) =>
        t ? `transform="${t}"` : ""
      )}
    >
    </rect> 
  `);

const expectCorrectSVGTransformListLength = ($el, config) => {
  const { numberOfItems: before_n } = $$getBaseTransformList($el);

  $$initScaleTransform()($el, config);

  const { numberOfItems: after_n } = $$getBaseTransformList($el);
  expect(after_n, "expectCorrectSVGTransformListLength").to.equal(before_n + 3);
};

const expectCorrectSVGTransform1 = ($el, config) => {
  const { index = 0, cx = 0, cy = 0 } = config || {};

  $$initScaleTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index);
  expect($$isTranslateSVGTransform(t), "expectCorrectSVGTransform1").to.be.true;
  expectSameValueSVGMatrix(
    t.matrix,
    { a: 1, b: 0, c: 0, d: 1, e: cx, f: cy },
    "expectCorrectSVGTransform1"
  );
};

const expectCorrectSVGTransform2 = ($el, config) => {
  const { index = 0, sx = 1, sy = 1 } = config || {};

  $$initScaleTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index + 1);
  expect($$isScaleSVGTransform(t), "expectCorrectSVGTransform2").to.be.true;
  expectSameValueSVGMatrix(
    t.matrix,
    { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 },
    "expectCorrectSVGTransform2"
  );
};

const expectCorrectSVGTransform3 = ($el, config) => {
  const { index = 0, cx = 0, cy = 0 } = config || {};

  $$initScaleTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index + 2);
  expect($$isTranslateSVGTransform(t), "expectCorrectSVGTransform3").to.be.true;
  expectSameValueSVGMatrix(
    t.matrix,
    { a: 1, b: 0, c: 0, d: 1, e: -cx, f: -cy },
    "expectCorrectSVGTransform3"
  );
};

const expectCorrectOtherSVGTransforms = ($el, config) => {
  const { index = 0 } = config || {};

  const before_l = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );

  $$initScaleTransform()($el, config);

  let after_l = deepCopyTransformListToMatrixList($$getBaseTransformList($el));
  after_l = [...after_l.slice(0, index), ...after_l.slice(index + 3)];
  expect(after_l, "expectCorrectOtherSVGTransforms").to.deep.equal(before_l);
};

const expectAllCorrect = ($el, config) =>
  each((f) => f($el, config), [
    expectCorrectSVGTransformListLength,
    expectCorrectSVGTransform1,
    expectCorrectSVGTransform2,
    expectCorrectSVGTransform3,
    expectCorrectOtherSVGTransforms,
  ]);

export default ({ describe, it }) => [
  describe(`$$initScaleTransform`, function () {
    describe(`No omitted arguments.`, function () {
      it(`The length of the element's SVGTransformList will be increased by 3.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy, sx, sy] = mapL(() => makeRandomNumber(), rangeL(4));
        expectCorrectSVGTransformListLength($el, { index, cx, cy, sx, sy });
      });

      it(`The SVGTransform at input index will be a translate SVGTransform with cx, cy.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));
        const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
        expectCorrectSVGTransform1($el, { index, cx, cy, sx, sy });
      });

      it(`The SVGTransform at index + 1 will be a scale SVGTransform with sx, sy.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomNumber(), rangeL(2));
        const [sx, sy] = mapL(() => makeRandomInt(), rangeL(2));
        expectCorrectSVGTransform2($el, { index, cx, cy, sx, sy });
      });

      it(`The SVGTransform at index + 2 will be a translate SVGTransform with -cx, -cy.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));
        const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
        expectCorrectSVGTransform3($el, { index, cx, cy, sx, sy });
      });

      it(`The function do nothing on other SVGTransforms of the element.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [sx, sy, cx, cy] = mapL(() => makeRandomNumber(), rangeL(4));
        expectCorrectOtherSVGTransforms($el, { index, cx, cy, sx, sy });
      });
    });

    it(`If the second argument is omitted, use default values ({ sx: 1, sy: 1, cx: 0, cy: 0, index: 0 }).`, function () {
      this.slow(1000);
      go(
        ["sx", "sy", "cx", "cy", "index"],
        makeAllCombinations,
        mapL((ks) => [createMockEl(), ks]),
        mapL(([$el, ks]) =>
          go(
            ks,
            mapL((k) => [
              k,
              equals2(k, "index")
                ? makeRandomInt(0, $$getBaseTransformList($el).numberOfItems)
                : makeRandomInt(),
            ]),
            object,
            (config) => [$el, config]
          )
        ),
        appendL([createMockEl()]),
        each(([$el, config]) => expectAllCorrect($el, config))
      );
    });
  }),
];
