import { expect } from "chai";
import { each, go, go1, mapL, zip } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "./getBaseTransformList.index.js";

export default ({ describe, it, beforeEach }) => [
  describe(`$$getBaseTransformList`, function () {
    let $el;

    beforeEach(function () {
      $el = $$el()(`
      <rect
        x="${makeRandomNumber()}" 
        y="${makeRandomNumber()}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        ${go1(makeRandomTransformAttributeValue(0, 100, makeRandomInt), (t) =>
          t ? `transform="${t}"` : ""
        )}
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
      go(
        zip(transform_str_list, transform_list),
        each(([, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_UNKNOWN) {
            expect(true, "INVALID TRANSFORM").to.be.false;
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_MATRIX) {
            const t = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([a, b, c, d, e, f]) => ({ a, b, c, d, e, f }),
              $$createSVGMatrix(),
              (matrix) => ({ matrix }),
              $$createSVGTransformMatrix()
            );
            expect(transform_str).to.have.string("matrix");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_TRANSLATE) {
            const t = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([tx, ty]) => ({ tx, ty }),
              $$createSVGTransformTranslate()
            );
            expect(transform_str).to.have.string("translate");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SCALE) {
            const t = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([sx, sy]) => ({ sx, sy }),
              $$createSVGTransformScale()
            );
            expect(transform_str).to.have.string("scale");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_ROTATE) {
            const t = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([angle, cx, cy]) => ({ angle, cx, cy }),
              $$createSVGTransformRotate()
            );
            expect(transform_str).to.have.string("rotate");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SKEWX) {
            const [t] = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              mapL((angle) => {
                const t = $$createSVGTransform();
                t.setSkewX(angle);
                return t;
              })
            );
            expect(transform_str).to.have.string("skewX");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SKEWY) {
            const t = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              mapL((angle) => {
                const t = $$createSVGTransform();
                t.setSkewY(angle);
                return t;
              })
            );
            expect(transform_str).to.have.string("skewY");
            expect(transform.matrix).to.deep.equal(t.matrix);
          }
        })
      );
    });
  }),
];
