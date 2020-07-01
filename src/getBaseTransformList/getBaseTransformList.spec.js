import { expect } from "chai";
import {
  defaultTo,
  each,
  eachL,
  equals2,
  go,
  head,
  join,
  mapL,
  rangeL,
  zip,
} from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeMockRect,
  makeRandomInt,
  makeRandomTransformAttributeValue,
  makeRandomTransformString,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "./getBaseTransformList.index.js";

const setupMock = ({
  transform = makeRandomTransformAttributeValue(),
} = {}) => {
  const $el = makeMockRect({ transform });
  const transform_list = $$getBaseTransformList($el);
  return { transform, transform_list };
};

export default ({ describe, it }) => [
  describe(`$$getBaseTransformList`, function () {
    it(`The return value is a SVGTransformList`, function () {
      const { transform_list } = setupMock();

      expect(transform_list).is.instanceof(SVGTransformList);
    });

    it(`The return transform list is empty, if the element have no transform.`, function () {
      const { transform_list } = setupMock({ transform: null });

      expect(transform_list.numberOfItems).to.equal(0);
    });

    it(`The return transform list have matched transforms with transform attribute.`, function () {
      this.slow(1000);
      const { transform_list, transform_str_list } = go(
        makeRandomInt(),
        rangeL,
        mapL(() => makeRandomInt(0, 3)),
        mapL((flag) => {
          if (equals2(flag, 1)) {
            return `skewX(${makeRandomInt(-700, 700)})`;
          }

          if (equals2(flag, 2)) {
            return `skewY(${makeRandomInt(-700, 700)})`;
          }

          return makeRandomTransformString(() => makeRandomInt(-700, 700));
        }),
        join(" "),
        defaultTo(null),
        (transform) => setupMock({ transform }),
        ({ transform, transform_list }) => {
          const transform_str_list = transform
            ? transform.match(/[a-zA-Z]+\((-?\d+(\.\d+)?\s?)+\)/gi) || []
            : [];
          return { transform_list, transform_str_list };
        }
      );

      expect(transform_list.numberOfItems).to.equal(transform_str_list.length);
      go(
        zip(transform_str_list, transform_list),
        eachL(([, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_UNKNOWN) {
            expect(true, "INVALID TRANSFORM").to.be.false;
          }
        }),
        eachL(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_MATRIX) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([a, b, c, d, e, f]) => ({ a, b, c, d, e, f }),
              (values) => $$createSVGMatrix(values)(),
              (matrix) => $$createSVGTransformMatrix({ matrix })()
            );
            expect(transform_str).to.have.string("matrix");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        }),
        eachL(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_TRANSLATE) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([tx, ty]) => ({ tx, ty }),
              $$createSVGTransformTranslate()
            );
            expect(transform_str).to.have.string("translate");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        }),
        eachL(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SCALE) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([sx, sy]) => ({ sx, sy }),
              $$createSVGTransformScale()
            );
            expect(transform_str).to.have.string("scale");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        }),
        eachL(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_ROTATE) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              ([angle, cx, cy]) => ({ angle, cx, cy }),
              $$createSVGTransformRotate()
            );
            expect(transform_str).to.have.string("rotate");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        }),
        eachL(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SKEWX) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              mapL((angle) => {
                const t = $$createSVGTransform();
                t.setSkewX(angle);
                return t;
              }),
              head
            );
            expect(transform_str).to.have.string("skewX");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        }),
        each(([transform_str, transform]) => {
          if (transform.type === transform.SVG_TRANSFORM_SKEWY) {
            const transform2 = go(
              transform_str.match(/(-?\d+(\.\d+)?)/gi),
              mapL(parseFloat),
              mapL((angle) => {
                const t = $$createSVGTransform();
                t.setSkewY(angle);
                return t;
              }),
              head
            );
            expect(transform_str).to.have.string("skewY");
            expectSameValueSVGMatrix(transform.matrix, transform2.matrix);
          }
        })
      );
    });
  }),
];
