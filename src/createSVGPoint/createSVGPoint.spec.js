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
import {
  $$createSVGPoint,
  $$createSVGPoint2,
  $$createSVGPoint3,
} from "./createSVGPoint.index.js";

const makeCases = () =>
  flatMapL(
    ($svg) =>
      go(
        ["x", "y"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt(-100, 100)]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        flatMapL((values) =>
          mapL((point) => ({ values, point }), [
            $$createSVGPoint($svg)(values),
            $$createSVGPoint2(values)($svg),
            $$createSVGPoint3(values, $svg),
          ])
        ),
        appendL({ point: $$createSVGPoint($svg)() }),
        appendL({ point: $$createSVGPoint2()($svg) }),
        appendL({ point: $$createSVGPoint3(undefined, $svg) })
        // $$createSVGPoint3() -> option, $svg 모두 기본값 사용시
      ),
    [undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg")]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGPoint`, function () {
    it(`The return value is a SVGPoint.`, function () {
      go(
        makeCases(),
        mapL(({ point: p }) => p),
        each((p) => expect(p).to.instanceof(SVGPoint))
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
          expect(point.x).to.equal(values.x);
          expect(point.y).to.equal(values.y);
        })
      );
    });
  }),
];
