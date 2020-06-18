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

export default ({ describe, it }) => [
  describe(`$$createSVGRect`, function () {
    it(`The return value is a SVGRect.`, function () {
      go(
        makeCases(),
        mapL(({ rect: r }) => r),
        each((r) => expect(r).to.instanceof(SVGRect))
      );
    });

    it(`Each value of the rect will be same with the given value.
        If there is omitted values or no argument,
        the values will be {x: 0, y: 0, width: 0, height: 0} individually by default.`, function () {
      go(
        makeCases(),
        mapL(({ rect, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ x: 0, y: 0, width: 0, height: 0 }, values),
            (values) => ({ rect, values })
          )
        ),
        each(({ rect, values }) => {
          expect(rect.x).to.equal(values.x);
          expect(rect.y).to.equal(values.y);
          expect(rect.width).to.equal(values.width);
          expect(rect.height).to.equal(values.height);
        })
      );
    });
  }),
];
