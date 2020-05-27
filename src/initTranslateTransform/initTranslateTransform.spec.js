import { expect } from "chai";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$initTranslateTransform } from "./initTranslateTransform.index.js";

describe(`$$initTranslateTransform`, function () {
  let $el;

  beforeEach(function () {
    const transform_str = makeRandomTransformAttributeValue();
    $el = $$el()(`
      <rect
        x="${makeRandomNumber()}"
        y="${makeRandomNumber()}"
        width="${Math.abs(makeRandomNumber())}"
        height="${Math.abs(makeRandomNumber())}"
        ${transform_str ? `transform="${transform_str}"` : ""}
      >
      </rect> 
    `);
  });

  it(`The length of the element's SVGTransformList will be increased by 1.`, function () {
    const { numberOfItems: before_n } = $$getBaseTransformList($el);

    $$initTranslateTransform()($el, {
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });

    const { numberOfItems: after_n } = $$getBaseTransformList($el);
    expect(after_n).to.equal(before_n + 1);
  });

  it(`The first SVGTransform will be a translate SVGTransform with the input tx, ty values.`, function () {
    const tx = makeRandomInt();
    const ty = makeRandomInt();

    $$initTranslateTransform()($el, { tx, ty });

    const t = $$getBaseTransformList($el).getItem(0);
    expect($$isTranslateSVGTransform(t)).to.be.true;
    expect(t.matrix.e).to.equal(tx);
    expect(t.matrix.f).to.equal(ty);
  });

  it(`The function do nothing on other SVGTransforms of the element.`, function () {
    const before_ts = [...$$getBaseTransformList($el)];

    $$initTranslateTransform()($el, {
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });

    const after_ts = [...$$getBaseTransformList($el)].slice(1);
    expect(after_ts.length).to.equal(before_ts.length);
    for (let i = 0; i < after_ts.length; i++) {
      const before_t = before_ts[i];
      const after_t = after_ts[i];
      expect(after_t).to.deep.equal(before_t);
    }
  });
});
