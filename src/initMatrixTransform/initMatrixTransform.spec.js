import { expect } from "chai";
import { appendL, each, equals2, go, go1, mapL, object } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeRandomSVGMatrix,
  makeRandomNumber,
  makeRandomInt,
  deepCopyTransformListToMatrixList,
  makeRandomTransformAttributeValue,
  makeAllCombinations,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { $$initMatrixTransform } from "./initMatrixTransform.index.js";

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

  $$initMatrixTransform()($el, config);

  const { numberOfItems: after_n } = $$getBaseTransformList($el);
  expect(after_n, "expectCorrectSVGTransformListLength").to.equal(before_n + 1);
};

const expectCorrectSVGTransform = ($el, config) => {
  const { matrix = $$createSVGMatrix()(), index = 0 } = config || {};

  $$initMatrixTransform()($el, config);

  const t = $$getBaseTransformList($el).getItem(index);
  expect($$isMatrixSVGTransform(t), "expectCorrectSVGTransform").to.be.true;
  expectSameValueSVGMatrix(t.matrix, matrix, "expectCorrectSVGTransform");
};

const expectCorrectOtherSVGTransforms = ($el, config) => {
  const { index = 0 } = config || {};

  const before_l = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );

  $$initMatrixTransform()($el, config);

  let after_l = deepCopyTransformListToMatrixList($$getBaseTransformList($el));
  after_l = [...after_l.slice(0, index), ...after_l.slice(index + 1)];
  expect(after_l, "expectCorrectOtherSVGTransforms").to.deep.equal(before_l);
};

const expectAllCorrect = ($el, config) =>
  each((f) => f($el, config), [
    expectCorrectSVGTransformListLength,
    expectCorrectSVGTransform,
    expectCorrectOtherSVGTransforms,
  ]);

describe(`$$initMatrixTransform`, function () {
  describe(`No omitted arguments,`, function () {
    it(`The length of the element's SVGTransformList will be increased by 1.`, function () {
      const $el = createMockEl();
      const matrix = makeRandomSVGMatrix();
      const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems);
      expectCorrectSVGTransformListLength($el, { matrix, index });
    });

    it(`The SVGTransform at input index is a matrix SVGTransform with the input SVGMatrix.`, function () {
      const $el = createMockEl();
      const matrix = makeRandomSVGMatrix();
      const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems);
      expectCorrectSVGTransform($el, { matrix, index });
    });

    it(`The function do nothing on other SVGTransforms of the element.`, function () {
      const $el = createMockEl();
      const matrix = makeRandomSVGMatrix();
      const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems);
      expectCorrectOtherSVGTransforms($el, { matrix, index });
    });
  });

  it(`If the second argument is omitted, use default values ({ matrix: Identity Matrix, index: 0 }).`, function () {
    go(
      ["matrix", "index"],
      makeAllCombinations,
      mapL((ks) => [createMockEl(), ks]),
      mapL(([$el, ks]) =>
        go(
          ks,
          mapL((k) => [
            k,
            equals2(k, "index")
              ? makeRandomInt(0, $$getBaseTransformList($el).numberOfItems)
              : makeRandomSVGMatrix(),
          ]),
          object,
          (config) => [$el, config]
        )
      ),
      appendL([createMockEl()]),
      each(([$el, config]) => expectAllCorrect($el, config))
    );
  });
});
