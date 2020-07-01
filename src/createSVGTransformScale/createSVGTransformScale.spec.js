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
  tap,
} from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale.index.js";

const makeCases = () =>
  go(
    ["sx", "sy"],
    makeAllCombinations,
    mapL(
      pipe(
        mapL((k) => [k, makeRandomInt()]),
        object
      )
    ),
    mapL((values) => ({ values, f: $$createSVGTransformScale(values) })),
    appendL({ f: $$createSVGTransformScale() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformScale`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((t) => expect(t).instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((transform) => expect($$isScaleSVGTransform(transform)).true)
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
        mapL(({ transform: receive_transform, values: { sx, sy } }) =>
          go(
            $$createSVGTransform(),
            tap((transform) => transform.setScale(sx, sy)),
            (expect_transform) => ({ receive_transform, expect_transform })
          )
        ),
        each(({ expect_transform, receive_transform }) =>
          expectSameValueSVGTransform(receive_transform, expect_transform)
        )
      );
    });
  }),
];
