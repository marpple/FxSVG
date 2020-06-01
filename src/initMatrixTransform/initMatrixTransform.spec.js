import { expect } from "chai";
import { drop, go1 } from "fxjs2";
import { deepCopyTransformListToMatrixList } from "../../test/utils/deepCopyTransformListToMatrixList.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { $$initMatrixTransform } from "./initMatrixTransform.index.js";

describe(`$$initMatrixTransform`, function () {
  let $el;

  beforeEach(function () {
    $el = $$el()(`
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
  });

  it(`The length of the element's SVGTransformList will be increased by 1.`, function () {
    const { numberOfItems: before_n } = $$getBaseTransformList($el);

    $$initMatrixTransform()($el, { matrix: makeRandomSVGMatrix() });

    const { numberOfItems: after_n } = $$getBaseTransformList($el);
    expect(after_n).to.equal(before_n + 1);
  });

  it(`The first SVGTransform will be a matrix SVGTransform with the input SVGMatrix.`, function () {
    const matrix = makeRandomSVGMatrix();

    $$initMatrixTransform()($el, { matrix });

    const t = $$getBaseTransformList($el).getItem(0);
    expect($$isMatrixSVGTransform(t)).to.be.true;
    expect(t.matrix).to.deep.equal(matrix);
  });

  it(`The function do nothing on other SVGTransforms of the element.`, function () {
    const before_l = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );

    $$initMatrixTransform()($el, { matrix: makeRandomSVGMatrix() });

    const after_l = drop(
      1,
      deepCopyTransformListToMatrixList($$getBaseTransformList($el))
    );
    expect(after_l).to.deep.equal(before_l);
  });
});
