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
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["tx", "ty"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => ({ values, t: f(values) })),
        appendL({ t: f() })
      ),
    [
      $$createSVGTransformTranslate(),
      $$createSVGTransformTranslate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

describe(`$$createSVGTransformTranslate`, function () {
  it(`The return value will be a SVGTransform.`, function () {
    go(
      makeCases(),
      mapL(({ t }) => t),
      each((t) => expect(t).to.instanceof(SVGTransform))
    );
  });

  it(`The SVGTransform's type will be the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
    go(
      makeCases(),
      mapL(({ t }) => t),
      mapL(({ type: t }) => t),
      each((t) => expect(t).to.equal(SVGTransform.SVG_TRANSFORM_TRANSLATE))
    );
  });

  it(`
  The SVGTransform's translate values will be same with the input values. (matrix.e = tx, matrix.f = ty)
  The omitted values will be 0.
  `, function () {
    each(({ t, values: { tx = 0, ty = 0 } = {} }) => {
      expect(t.matrix.e).to.equal(tx);
      expect(t.matrix.f).to.equal(ty);
    }, makeCases());
  });
});
