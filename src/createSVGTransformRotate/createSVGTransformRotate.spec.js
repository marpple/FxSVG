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
import {
  makeAllCombinations,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["angle", "cx", "cy"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomNumber()]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => [f(values), values]),
        appendL([f()])
      ),
    [
      $$createSVGTransformRotate(),
      $$createSVGTransformRotate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

describe(`$$createSVGTransformRotate`, function () {
  it(`The return value is a SVGTransform.`, function () {
    go(
      makeCases(),
      mapL(([t]) => t),
      each((t) => expect(t).to.instanceof(SVGTransform))
    );
  });

  it(`The SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
    go(
      makeCases(),
      mapL(([t]) => t),
      mapL(({ type }) => type),
      each((t) => expect(t).to.equal(SVGTransform.SVG_TRANSFORM_ROTATE))
    );
  });

  it(`
  The SVGTransform's matrix is same with the result using native API(SVGTransform.setRotate). 
  If some arguments are omitted, the omitted values will be 0.
  `, function () {
    go(
      makeCases(),
      mapL(([t1, { angle = 0, cx = 0, cy = 0 } = {}]) => {
        const t2 = $$createSVGTransform();
        t2.setRotate(angle, cx, cy);
        return [t1, t2];
      }),
      each(([t1, t2]) => expect(t1).to.deep.equal(t2))
    );
  });
});
