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
} from "fxjs2";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

const makeCases = () =>
  go(
    ["x", "y"],
    makeAllCombinations,
    mapL(
      pipe(
        mapL((k) => [k, makeRandomInt(-100, 100)]),
        object
      )
    ),
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
      go(
        makeCases(),
        mapL(({ point: p }) => p),
        each((p) => expect(p).instanceof(SVGPoint))
      );
    });

    it(`Each value of the point will be same with the given value.
        If there is omitted values or no argument,
        the values will be {x: 0, y: 0} individually by default.`, function () {
      go(
        makeCases(),
        mapL(({ point, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ x: 0, y: 0 }, values),
            (values) => ({ point, values })
          )
        ),
        each(({ point, values }) => {
          expect(point.x).equal(values.x);
          expect(point.y).equal(values.y);
        })
      );
    });
  }),
];
