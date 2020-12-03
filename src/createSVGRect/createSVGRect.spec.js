import chai from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs/esm";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGRect } from "./createSVGRect.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["x", "y", "width", "height"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomInt()])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGRect(values) })),
    appendL({ f: $$createSVGRect() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, rect: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGRect`, function () {
    it(`The return value is a SVGRect.`, function () {
      for (const { rect } of makeCases()) {
        expect(rect).instanceof(SVGRect);
      }
    });

    it(`Each value of the rect will be same with the given value.
        If there is omitted values or no argument,
        the values will be {x: 0, y: 0, width: 0, height: 0} individually by default.`, function () {
      for (const { rect, values } of makeCases()) {
        const expect_values = extend(
          { x: 0, y: 0, width: 0, height: 0 },
          defaultTo({}, values)
        );
        expect(rect.x).equal(expect_values.x);
        expect(rect.y).equal(expect_values.y);
        expect(rect.width).equal(expect_values.width);
        expect(rect.height).equal(expect_values.height);
      }
    });
  }),
];
