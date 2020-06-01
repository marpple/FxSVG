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
import { $$createSVGRect } from "./createSVGRect.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["x", "y", "width", "height"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            mapL((ks) => object([ks])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => ({ values, rect: f(values) })),
        appendL({ rect: f() })
      ),
    [
      $$createSVGRect(),
      $$createSVGRect(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

describe(`$$createSVGRect`, function () {
  it(`The return value will be a SVGRect.`, function () {
    go(
      makeCases(),
      mapL(({ rect: r }) => r),
      each((r) => expect(r).to.instanceof(SVGRect))
    );
  });

  it(`
  The SVGRect's each values are same with input values.
  The omitted values will be 0.
  `, function () {
    each(({ rect, values: { x = 0, y = 0, width = 0, height = 0 } = {} }) => {
      expect(rect.x).to.equal(x);
      expect(rect.y).to.equal(y);
      expect(rect.width).to.equal(width);
      expect(rect.height).to.equal(height);
    }, makeCases());
  });
});
