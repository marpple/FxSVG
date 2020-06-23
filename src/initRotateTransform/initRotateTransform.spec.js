import { expect } from "chai";
import {
  appendL,
  each,
  equals2,
  go,
  go1,
  mapL,
  object,
  rangeL,
  rejectL,
} from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeAllCombinations,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$initRotateTransform } from "./initRotateTransform.index.js";

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

  $$initRotateTransform()($el, config);

  const { numberOfItems: after_n } = $$getBaseTransformList($el);
  expect(after_n, "expectCorrectSVGTransformListLength").to.equal(before_n + 3);
};

const expectCorrectSVGTransform1 = ($el, config) => {
  const { index = 0, cx = 0, cy = 0 } = config || {};

  $$initRotateTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index);
  expect($$isTranslateSVGTransform(t), "expectCorrectSVGTransform1").to.be.true;
  expectSameValueSVGMatrix(
    t.matrix,
    { a: 1, b: 0, c: 0, d: 1, e: cx, f: cy },
    "expectCorrectSVGTransform1"
  );
};

const expectCorrectSVGTransform2 = ($el, config) => {
  const { index = 0, angle = 0 } = config || {};

  $$initRotateTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index + 1);
  expect($$isRotateSVGTransform(t), "expectCorrectSVGTransform2").to.be.true;
  expect(t.angle).to.equal(angle);
  expect(t.matrix.e).to.equal(0);
  expect(t.matrix.f).to.equal(0);
};

const expectCorrectSVGTransform3 = ($el, config) => {
  const { index = 0, cx = 0, cy = 0 } = config || {};

  $$initRotateTransform()($el, config);

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

  const before_l = deepCopyTransformList(
    $$getBaseTransformList($el)
  );

  $$initRotateTransform()($el, config);

  let after_l = deepCopyTransformList($$getBaseTransformList($el));
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
  describe(`$$initRotateTransform`, function () {
    describe(`No omitted arguments.`, function () {
      it(`The length of the element's SVGTransformList will be increased by 3.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
        expectCorrectSVGTransformListLength($el, { angle, cx, cy, index });
      });

      it(`The first SVGTransform will be a translate SVGTransform with cx, cy.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));
        const angle = makeRandomNumber();
        expectCorrectSVGTransform1($el, { index, cx, cy, angle });
      });

      it(`The second SVGTransform will be a rotate SVGTransform with angle, cx = 0, cy = 0.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomNumber(), rangeL(2));
        const angle = makeRandomInt();
        expectCorrectSVGTransform2($el, { angle, cx, cy, index });
      });

      it(`The third SVGTransform will be a translate SVGTransform with -cx, -cy.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));
        const angle = makeRandomNumber();
        expectCorrectSVGTransform3($el, { angle, cx, cy, index });
      });

      it(`The function do nothing on other SVGTransforms of the element.`, function () {
        const $el = createMockEl();
        const index = makeRandomInt(
          0,
          $$getBaseTransformList($el).numberOfItems
        );
        const [cx, cy, angle] = mapL(() => makeRandomNumber(), rangeL(3));
        expectCorrectOtherSVGTransforms($el, { angle, cx, cy, index });
      });
    });

    it(`If the second argument is omitted, use default values ({ angle: 0, cx: 0, cy: 0, index: 0 }).`, function () {
      this.slow(200);
      go(
        ["angle", "cx", "cy", "index"],
        makeAllCombinations,
        rejectL((ks) => equals2(ks.length, 4)),
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
