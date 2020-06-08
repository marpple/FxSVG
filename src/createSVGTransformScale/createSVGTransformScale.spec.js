import { expect } from "chai";
import {
  appendL,
  defaultTo,
  each,
  extend,
  flatMapL,
  go,
  mapL,
  object,
  pipe,
  reduce,
} from "fxjs2";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["sx", "sy"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => ({ t: f(values), values })),
        appendL({ t: f() })
      ),
    [
      $$createSVGTransformScale(),
      $$createSVGTransformScale(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformScale`, function () {
    it(`The return value will be a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ t }) => t),
        each((t) => expect(t).to.instanceof(SVGTransform))
      );
    });

    it(`The SVGTransform's type will be the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      go(
        makeCases(),
        mapL(({ t }) => t),
        mapL(({ type: t }) => t),
        each((t) => expect(t).to.equal(SVGTransform.SVG_TRANSFORM_SCALE))
      );
    });

    it(`
  The SVGTransform's scale value will be set to the input value. (matrix.a = sx, matrix.d = sy)
  The omitted values will be 1.
  `, function () {
      each(({ t, values: { sx = 1, sy = 1 } = {} }) => {
        expect(t.matrix.a).to.equal(sx);
        expect(t.matrix.d).to.equal(sy);
      }, makeCases());
    });
  }),
];
