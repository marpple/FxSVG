import chai from "chai";
import { equals2, go, map, mapL, rejectL, zipL, zipWithIndexL } from "fxjs/es";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRectInitializedTranslateTransform,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$mergeTranslateTransform } from "./mergeTranslateTransform.index.js";

const { expect } = chai;

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const expectSameValueTransformList = (
  receive_transform_list,
  expect_transform_list,
  description = "expectSameValueTransformList"
) => {
  expect(receive_transform_list.length).equal(expect_transform_list.length);
  const pairs = zipL(receive_transform_list, expect_transform_list);
  for (const [receive_transform, expect_transform] of pairs) {
    expectSameValueSVGTransform(
      receive_transform,
      expect_transform,
      description
    );
  }
};

export default ({ describe, it }) => [
  describe(`$$mergeTranslateTransform`, function () {
    it(`The function do nothing but return the input $el when the input index is out of bounds.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el: $input } = makeMockRectInitializedTranslateTransform();
        const { numberOfItems: transform_list_length } = $$getBaseTransformList(
          $input
        );
        const [before_x, before_y] = mapL((k) => $$getAttrNS(k)($input), [
          "x",
          "y",
        ]);
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        const index = makeRandomBool()
          ? transform_list_length + makeRandomInt(1)
          : -makeRandomInt(1);

        const $output = $$mergeTranslateTransform({
          index,
          x_name: "x",
          y_name: "y",
        })($input, $svg);

        const [after_x, after_y] = mapL((k) => $$getAttrNS(k)($output), [
          "x",
          "y",
        ]);
        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($output)
        );
        expect($output).equal($input);
        expect(after_x).equal(before_x);
        expect(after_y).equal(before_y);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list
        );
      }
    });

    describe(`The function do nothing but return the input $el
              when the transform at input index is not a translate transform.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedTranslateTransform({
            transform: makeRandomTransformAttributeValue(1, 100, () =>
              makeRandomNumber(-700, 700)
            ),
          });
          $$getBaseTransformList($input).removeItem(index);
          $$getBaseTransformList($input).insertItemBefore(
            $$createSVGTransformMatrix({
              matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
            })(),
            index
          );
          const [before_x, before_y] = mapL((k) => $$getAttrNS(k)($input), [
            "x",
            "y",
          ]);
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform({
            index,
            x_name: "x",
            y_name: "y",
          })($input, $svg);

          const [after_x, after_y] = mapL((k) => $$getAttrNS(k)($output), [
            "x",
            "y",
          ]);
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );
          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });

      it(`When the transform is a rotate transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedTranslateTransform({
            transform: makeRandomTransformAttributeValue(1, 100, () =>
              makeRandomNumber(-700, 700)
            ),
          });
          $$getBaseTransformList($input).removeItem(index);
          $$getBaseTransformList($input).insertItemBefore(
            $$createSVGTransformRotate({
              angle: makeRandomNumber(-700, 700),
              cx: makeRandomNumber(-100, 100),
              cy: makeRandomNumber(-100, 100),
            })(),
            index
          );
          const [before_x, before_y] = mapL((k) => $$getAttrNS(k)($input), [
            "x",
            "y",
          ]);
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform({
            index,
            x_name: "x",
            y_name: "y",
          })($input, $svg);

          const [after_x, after_y] = mapL((k) => $$getAttrNS(k)($output), [
            "x",
            "y",
          ]);
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );
          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });

      it(`When the transform is a scale transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedTranslateTransform({
            transform: makeRandomTransformAttributeValue(1, 100, () =>
              makeRandomNumber(-700, 700)
            ),
          });
          $$getBaseTransformList($input).removeItem(index);
          $$getBaseTransformList($input).insertItemBefore(
            $$createSVGTransformScale({
              sx: makeRandomNumber(-100, 100),
              sy: makeRandomNumber(-100, 100),
            })(),
            index
          );
          const [before_x, before_y] = mapL((k) => $$getAttrNS(k)($input), [
            "x",
            "y",
          ]);
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform({
            index,
            x_name: "x",
            y_name: "y",
          })($input, $svg);

          const [after_x, after_y] = mapL((k) => $$getAttrNS(k)($output), [
            "x",
            "y",
          ]);
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );

          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });
    });

    it(`The transform at the input index is removed from the SVG transform list of the input $el.
        The other transforms are changed by translate(tx, ty) * transform * translate(-tx, -ty).`, function () {
      for (const $svg of setupSVGList()) {
        const {
          $el: $input,
          index,
          tx,
          ty,
        } = makeMockRectInitializedTranslateTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeTranslateTransform({
          index,
          x_name: "x",
          y_name: "y",
        })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($output)
        );
        const expect_transform_list = go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(i, index)),
          mapL(([, transform]) => transform),
          mapL(({ matrix }) => matrix),
          mapL((matrix) =>
            $$createSVGTransformTranslate({ tx, ty })()
              .matrix.multiply(matrix)
              .multiply(
                $$createSVGTransformTranslate({ tx: -tx, ty: -ty })().matrix
              )
          ),
          map((matrix) => $$createSVGTransformMatrix({ matrix })())
        );
        expectSameValueTransformList(
          after_transform_list,
          expect_transform_list
        );
      }
    });

    it(`The x, y values is added by the tx, ty of the transform.`, function () {
      for (const $svg of setupSVGList()) {
        const {
          $el: $input,
          index,
          tx,
          ty,
          x,
          y,
        } = makeMockRectInitializedTranslateTransform();

        const $output = $$mergeTranslateTransform({
          index,
          x_name: "x",
          y_name: "y",
        })($input, $svg);

        expect($$getAttrNS("x")($output)).equal(`${x + tx}`);
        expect($$getAttrNS("y")($output)).equal(`${y + ty}`);
      }
    });
  }),
];
