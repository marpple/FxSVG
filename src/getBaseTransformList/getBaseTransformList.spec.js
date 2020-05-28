import { expect } from "chai";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import {$$createSVGTransform} from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import {$$createSVGTransformRotate} from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import {$$createSVGTransformScale} from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "./getBaseTransformList.index.js";

describe(`$$getBaseTransformList`, function () {
  let $el;

  beforeEach(function () {
    const transform_attr = makeRandomTransformAttributeValue(
      0,
      100,
      makeRandomInt
    );
    $el = $$el()(`
      <rect
        x="${makeRandomNumber()}" 
        y="${makeRandomNumber()}"
        width="${Math.abs(makeRandomNumber()) + 1}"
        height="${Math.abs(makeRandomNumber()) + 1}"
        ${transform_attr ? `transform="${transform_attr}"` : ""}
      >
      </rect> 
    `);
  });

  it(`The return value is a SVGTransformList`, function () {
    const tl = $$getBaseTransformList($el);

    expect(tl).is.instanceof(SVGTransformList);
  });

  it(`The return list is empty, if the element have no transform attribute.`, function () {
    $el.removeAttributeNS(null, "transform");
    const tl = $$getBaseTransformList($el);

    expect(tl.numberOfItems).to.equal(0);
  });

  it(`The return list have matched SVGTransforms with transform attribute.`, function () {
    const transform_attr = $el.getAttributeNS(null, "transform") || "";
    const transform_str_list =
      transform_attr.match(/[a-zA-Z]+\((-?\d+(\.\d+)?\s?)+\)/gi) || [];

    const transform_list = $$getBaseTransformList($el);

    expect(transform_list.numberOfItems).to.equal(transform_str_list.length);
    for (let i = 0; i < transform_str_list.length; i++) {
      const transform_str = transform_str_list[i];
      const transform = transform_list.getItem(i);

      if (transform.type === transform.SVG_TRANSFORM_UNKNOWN) {
        expect(true, "INVALID TRANSFORM").to.be.false;
      } else if (transform.type === transform.SVG_TRANSFORM_MATRIX) {
        const [a, b, c, d, e, f] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransformMatrix()(
          $$createSVGMatrix()({ a, b, c, d, e, f })
        );
        expect(transform_str).to.have.string("matrix");
        expect(transform.matrix).to.deep.equal(t.matrix);
      } else if (transform.type === transform.SVG_TRANSFORM_TRANSLATE) {
        const [tx, ty] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransformTranslate()({ tx, ty });
        expect(transform_str).to.have.string("translate");
        expect(transform.matrix).to.deep.equal(t.matrix);
      } else if (transform.type === transform.SVG_TRANSFORM_SCALE) {
        const [sx, sy] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransformScale()({ sx, sy });
        expect(transform_str).to.have.string("scale");
        expect(transform.matrix).to.deep.equal(t.matrix);
      } else if (transform.type === transform.SVG_TRANSFORM_ROTATE) {
        const [angle, cx, cy] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransformRotate()({ angle, cx, cy });
        expect(transform_str).to.have.string("rotate");
        expect(transform.matrix).to.deep.equal(t.matrix);
      } else if (transform.type === transform.SVG_TRANSFORM_SKEWX) {
        const [angle] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransform();
        t.setSkewX(angle);
        expect(transform_str).to.have.string("skewX");
        expect(transform.matrix).to.deep.equal(t.matrix);
      } else if (transform.type === transform.SVG_TRANSFORM_SKEWY) {
        const [angle] = transform_str
          .match(/(-?\d+(\.\d+)?)/gi)
          .map((n) => parseFloat(n));
        const t = $$createSVGTransform();
        t.setSkewY(angle);
        expect(transform_str).to.have.string("skewY");
        expect(transform.matrix).to.deep.equal(t.matrix);
      }
    }
  });
});
