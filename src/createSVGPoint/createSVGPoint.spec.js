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
import { $$createSVGPoint } from "./createSVGPoint.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["x", "y"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => ({ values, point: f(values) })),
        appendL({ point: f() })
      ),
    [
      $$createSVGPoint(),
      $$createSVGPoint(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

export default () => [
  describe(`$$createSVGPoint`, function () {
    it(`The return value will be a SVGPoint.`, function () {
      go(
        makeCases(),
        mapL(({ point: p }) => p),
        each((p) => expect(p).to.instanceof(SVGPoint))
      );
    });

    it(`
  The point's x, y value will be same with input value.
  The omitted value will be 0.
  `, function () {
      each(({ point, values: { x = 0, y = 0 } = {} }) => {
        expect(point.x).to.equal(x);
        expect(point.y).to.equal(y);
      }, makeCases());
    });
  }),
];
