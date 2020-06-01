import { expect } from "chai";
import { drop, go1, mapL, rangeL } from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$initRotateTransform } from "./initRotateTransform.index.js";

describe(`$$initRotateTransform`, function () {
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

  it(`The length of the element's SVGTransformList will be increased by 3.`, function () {
    const { numberOfItems: before_n } = $$getBaseTransformList($el);

    $$initRotateTransform()($el, {
      angle: makeRandomNumber(),
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });

    const { numberOfItems: after_n } = $$getBaseTransformList($el);
    expect(after_n).to.equal(before_n + 3);
  });

  it(`The first SVGTransform will be a translate SVGTransform with cx, cy.`, function () {
    const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));

    $$initRotateTransform()($el, { angle: makeRandomNumber(), cx, cy });

    const t = $$getBaseTransformList($el).getItem(0);
    expect($$isTranslateSVGTransform(t)).to.be.true;
    expect(t.matrix.e).to.equal(cx);
    expect(t.matrix.f).to.equal(cy);
  });

  it(`The second SVGTransform will be a rotate SVGTransform with angle, cx = 0, cy = 0.`, function () {
    const angle = makeRandomInt();

    $$initRotateTransform()($el, {
      angle,
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });

    const t = $$getBaseTransformList($el).getItem(1);
    expect($$isRotateSVGTransform(t)).to.be.true;
    expect(t.angle).to.equal(angle);
    expect(t.matrix.e).to.equal(0);
    expect(t.matrix.f).to.equal(0);
  });

  it(`The third SVGTransform will be a translate SVGTransform with -cx, -cy.`, function () {
    const [cx, cy] = mapL(() => makeRandomInt(), rangeL(2));

    $$initRotateTransform()($el, { angle: makeRandomNumber(), cx, cy });

    const t = $$getBaseTransformList($el).getItem(2);
    expect($$isTranslateSVGTransform(t)).to.be.true;
    expect(t.matrix.e).to.equal(-cx);
    expect(t.matrix.f).to.equal(-cy);
  });

  it(`The function do nothing on other SVGTransforms of the element.`, function () {
    const before_l = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );

    $$initRotateTransform()($el, {
      angle: makeRandomNumber(),
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });

    const after_l = drop(
      3,
      deepCopyTransformListToMatrixList($$getBaseTransformList($el))
    );
    expect(after_l).to.deep.equal(before_l);
  });
});