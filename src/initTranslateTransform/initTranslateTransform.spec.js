import { expect } from "chai";
import { appendL, each, equals2, go, go1, mapL, object, rangeL } from "fxjs2";
import {
  deepCopyTransformList,
  makeAllCombinations,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$initTranslateTransform } from "./initTranslateTransform.index.js";

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

  $$initTranslateTransform()($el, config);

  const { numberOfItems: after_n } = $$getBaseTransformList($el);
  expect(after_n, "expectCorrectSVGTransformListLength").to.equal(before_n + 1);
};

const expectCorrectSVGTransform = ($el, config) => {
  const { index = 0, tx = 0, ty = 0 } = config || {};

  $$initTranslateTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index);
  expect($$isTranslateSVGTransform(t), "expectCorrectSVGTransform").to.be.true;
  expectSameValueSVGMatrix(
    t.matrix,
    { a: 1, b: 0, c: 0, d: 1, e: tx, f: ty },
    "expectCorrectSVGTransform"
  );
};

const expectCorrectOtherSVGTransforms = ($el, config) => {
  const { index = 0 } = config || {};

  const before_l = deepCopyTransformList(
    $$getBaseTransformList($el)
  );

  $$initTranslateTransform()($el, config);

  let after_l = deepCopyTransformList($$getBaseTransformList($el));
  after_l = [...after_l.slice(0, index), ...after_l.slice(index + 1)];
  expect(after_l, "expectCorrectOtherSVGTransforms").to.deep.equal(before_l);
};

const expectAllCorrect = ($el, config) =>
  each((f) => f($el, config), [
    expectCorrectSVGTransformListLength,
    expectCorrectSVGTransform,
    expectCorrectOtherSVGTransforms,
  ]);

export default ({ describe, it }) => [
  describe(`$$initTranslateTransform`, function () {
    describe(`No omitted arguments.`, function () {
      it(`The length of the element's SVGTransformList will be increased by 1.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [tx, ty] = mapL(() => makeRandomNumber(), rangeL(2));
        expectCorrectSVGTransformListLength($el, { tx, ty, index });
      });

      it(`The SVGTransform at input index is a translate SVGTransform with the input tx, ty values.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [tx, ty] = mapL(() => makeRandomInt(), rangeL(2));
        expectCorrectSVGTransform($el, { index, tx, ty });
      });

      it(`The function do nothing on other SVGTransforms of the element.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [tx, ty] = mapL(() => makeRandomNumber(), rangeL(2));
        expectCorrectOtherSVGTransforms($el, { index, tx, ty });
      });
    });

    it(`If the second argument is omitted, use default values ({ tx: 0, ty: 0, index: 0 }).`, function () {
      go(
        ["tx", "ty", "index"],
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
