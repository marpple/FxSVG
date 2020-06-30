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
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import {
  $$createSVGTransformScale,
  $$createSVGTransformScale2,
  $$createSVGTransformScale3,
} from "./createSVGTransformScale.index.js";

const makeCases = () =>
  flatMapL(
    ($svg) =>
      go(
        ["sx", "sy"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            object
          )
        ),
        flatMapL((values) =>
          mapL((transform) => ({ values, transform }), [
            $$createSVGTransformScale($svg)(values),
            $$createSVGTransformScale2(values)($svg),
            $$createSVGTransformScale3(values, $svg),
          ])
        ),
        appendL({ transform: $$createSVGTransformScale($svg)() }),
        appendL({ transform: $$createSVGTransformScale2()($svg) }),
        appendL({ transform: $$createSVGTransformScale3(undefined, $svg) })
      ),
    [undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg")]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformScale`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((t) => expect(t).to.instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        mapL(({ type: t }) => t),
        each((type) => expect(type).to.equal(SVGTransform.SVG_TRANSFORM_SCALE))
      );
    });

    it(`The transform is initialized with the given sx, sy.
        If there are omitted values or no argument,
        the values will be {sx: 1, sy: 1} individually by default.`, function () {
      go(
        makeCases(),
        mapL(({ transform, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ sx: 1, sy: 1 }, values),
            (values) => ({ values, transform })
          )
        ),
        mapL(({ transform: receive_transform, values: { sx, sy } }) => {
          const expect_transform = $$createSVGTransform();
          expect_transform.setScale(sx, sy);
          return { receive_transform, expect_transform };
        }),
        each(({ expect_transform, receive_transform }) =>
          expectSameValueSVGTransform(receive_transform, expect_transform)
        )
      );
    });
  }),
];
