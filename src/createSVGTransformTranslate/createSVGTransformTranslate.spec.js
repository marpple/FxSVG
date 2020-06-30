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
  $$createSVGTransformTranslate,
  $$createSVGTransformTranslate2,
  $$createSVGTransformTranslate3,
} from "./createSVGTransformTranslate.index.js";

const makeCases = () =>
  flatMapL(
    ($svg) =>
      go(
        ["tx", "ty"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt()]),
            object
          )
        ),
        flatMapL((values) =>
          mapL((transform) => ({ values, transform }), [
            $$createSVGTransformTranslate($svg)(values),
            $$createSVGTransformTranslate2(values)($svg),
            $$createSVGTransformTranslate3(values, $svg),
          ])
        ),
        appendL({ transform: $$createSVGTransformTranslate($svg)() }),
        appendL({ transform: $$createSVGTransformTranslate2()($svg) }),
        appendL({ transform: $$createSVGTransformTranslate3(undefined, $svg) })
      ),
    [undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg")]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformTranslate`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((t) => expect(t).to.instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        mapL(({ type: t }) => t),
        each((type) =>
          expect(type).to.equal(SVGTransform.SVG_TRANSFORM_TRANSLATE)
        )
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
        mapL(({ transform: receive_transform, values: { tx, ty } }) => {
          const expect_transform = $$createSVGTransform();
          expect_transform.setTranslate(tx, ty);
          return { receive_transform, expect_transform };
        }),
        each(({ receive_transform, expect_transform }) =>
          expectSameValueSVGTransform(receive_transform, expect_transform)
        )
      );
    });
  }),
];
