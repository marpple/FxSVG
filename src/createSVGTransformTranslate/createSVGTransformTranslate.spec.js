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
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.index.js";

const makeCases = () =>
  go(
    ["tx", "ty"],
    makeAllCombinations,
    mapL(
      pipe(
        mapL((k) => [k, makeRandomInt()]),
        object
      )
    ),
    mapL((values) => ({ values, f: $$createSVGTransformTranslate(values) })),
    appendL({ f: $$createSVGTransformTranslate() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformTranslate`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((t) => expect(t).instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((transform) => expect($$isTranslateSVGTransform(transform)).true)
      );
    });

    it(`The transform is initialized with the given tx, ty.
        If there are omitted values or no argument,
        the values will be {tx: 0, ty: 0} individually by default.`, function () {
      go(
        makeCases(),
        mapL(({ transform, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ tx: 0, ty: 0 }, values),
            (values) => ({ values, transform })
          )
        ),
        mapL(({ transform: receive_transform, values: { tx, ty } }) =>
          go(
            $$createSVGTransform(),
            tap((transform) => transform.setTranslate(tx, ty)),
            (expect_transform) => ({ receive_transform, expect_transform })
          )
        ),
        each(({ receive_transform, expect_transform }) =>
          expectSameValueSVGTransform(receive_transform, expect_transform)
        )
      );
    });
  }),
];
