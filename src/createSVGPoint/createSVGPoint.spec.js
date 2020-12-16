import chai from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs/es";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["x", "y"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomInt(-100, 100)])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGPoint(values) })),
    appendL({ f: $$createSVGPoint() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, point: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGPoint`, function () {
    it(`The return value is a SVGPoint.`, function () {
      for (const { point } of makeCases()) {
        expect(point).instanceof(SVGPoint);
      }
    });

    it(`Each value of the point will be same with the given value.
        If there is omitted values or no argument,
        the values will be {x: 0, y: 0} individually by default.`, function () {
      for (const { point, values } of makeCases()) {
        const expect_values = extend({ x: 0, y: 0 }, defaultTo({}, values));
        expect(point.x).equal(expect_values.x);
        expect(point.y).equal(expect_values.y);
      }
    });
  }),
];
