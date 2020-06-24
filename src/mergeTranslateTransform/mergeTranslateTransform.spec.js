import { expect } from "chai";
import { each, equals2, go, mapL, rejectL, zipL, zipWithIndexL } from "fxjs2";
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
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$mergeTranslateTransform } from "./mergeTranslateTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$mergeTranslateTransform`, function () {
    it(`The function do nothing but return the input $el when the input index is out of bounds.`, function () {
      const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);
      for (const f of fs) {
        const { $el: $input } = makeMockRectInitializedTranslateTransform();
        const { numberOfItems: transform_list_length } = $$getBaseTransformList(
          $input
        );
        const [before_x, before_y] = mapL(
          (k) => $input.getAttributeNS(null, k),
          ["x", "y"]
        );
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const index = makeRandomBool()
          ? transform_list_length + makeRandomInt(1)
          : -makeRandomInt(1);
        const $output = $$mergeTranslateTransform()($input, {
          index,
          x_name: "x",
          y_name: "y",
        });
        const [after_x, after_y] = mapL(
          (k) => $output.getAttributeNS(null, k),
          ["x", "y"]
        );
        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($output)
        );
        expect($output).equal($input);
        expect(after_x).equal(before_x);
        expect(after_y).equal(before_y);
        expect(after_transform_list).deep.equal(before_transform_list);
      }
    });

    describe(`The function do nothing but return the input $el
              when the transform at input index is not a translate transform.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
          undefined,
          document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        ]);
        for (const f of fs) {
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
            $$createSVGTransformMatrix()({
              matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
            }),
            index
          );
          const [before_x, before_y] = mapL(
            (k) => $input.getAttributeNS(null, k),
            ["x", "y"]
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform()($input, {
            index,
            x_name: "x",
            y_name: "y",
          });
          const [after_x, after_y] = mapL(
            (k) => $output.getAttributeNS(null, k),
            ["x", "y"]
          );
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );

          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expect(after_transform_list).deep.equal(before_transform_list);
        }
      });

      it(`When the transform is a rotate transform...`, function () {
        const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
          undefined,
          document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        ]);
        for (const f of fs) {
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
            $$createSVGTransformRotate()({
              angle: makeRandomNumber(-700, 700),
              cx: makeRandomNumber(-100, 100),
              cy: makeRandomNumber(-100, 100),
            }),
            index
          );
          const [before_x, before_y] = mapL(
            (k) => $input.getAttributeNS(null, k),
            ["x", "y"]
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform()($input, {
            index,
            x_name: "x",
            y_name: "y",
          });
          const [after_x, after_y] = mapL(
            (k) => $output.getAttributeNS(null, k),
            ["x", "y"]
          );
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );

          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expect(after_transform_list).deep.equal(before_transform_list);
        }
      });

      it(`When the transform is a scale transform...`, function () {
        const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
          undefined,
          document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        ]);
        for (const f of fs) {
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
            $$createSVGTransformScale()({
              sx: makeRandomNumber(-100, 100),
              sy: makeRandomNumber(-100, 100),
            }),
            index
          );
          const [before_x, before_y] = mapL(
            (k) => $input.getAttributeNS(null, k),
            ["x", "y"]
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeTranslateTransform()($input, {
            index,
            x_name: "x",
            y_name: "y",
          });
          const [after_x, after_y] = mapL(
            (k) => $output.getAttributeNS(null, k),
            ["x", "y"]
          );
          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($output)
          );

          expect($output).equal($input);
          expect(after_x).equal(before_x);
          expect(after_y).equal(before_y);
          expect(after_transform_list).deep.equal(before_transform_list);
        }
      });
    });

    it(`The transform at the input index is removed from the SVG transform list of the input $el.
        The other transforms are changed by translate(tx, ty) * transform * translate(-tx, -ty).`, function () {
      const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);
      for (const f of fs) {
        const {
          $el: $input,
          index,
          tx,
          ty,
        } = makeMockRectInitializedTranslateTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = f($input, { index, x_name: "x", y_name: "y" });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($output)
        );

        go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(i, index)),
          mapL(([, transform]) => transform),
          mapL(({ matrix }) => matrix),
          mapL((matrix) =>
            $$createSVGTransformTranslate()({ tx, ty })
              .matrix.multiply(matrix)
              .multiply(
                $$createSVGTransformTranslate()({ tx: -tx, ty: -ty }).matrix
              )
          ),
          mapL((matrix) => $$createSVGTransformMatrix()({ matrix })),
          zipL(after_transform_list),
          each(
            ([
              { type: expect_type, matrix: expect_matrix },
              { type: receive_type, matrix: receive_matrix },
            ]) => {
              expect(receive_type).equal(expect_type);
              expect(receive_matrix).deep.equal(expect_matrix);
            }
          )
        );
      }
    });

    it(`The x, y values is added by the tx, ty of the transform.`, function () {
      const fs = mapL(($svg) => $$mergeTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);
      for (const f of fs) {
        const {
          $el: $input,
          index,
          tx,
          ty,
          x,
          y,
        } = makeMockRectInitializedTranslateTransform();

        const $output = f($input, { index, x_name: "x", y_name: "y" });

        expect($output.getAttributeNS(null, "x")).equal(`${x + tx}`);
        expect($output.getAttributeNS(null, "y")).equal(`${y + ty}`);
      }
    });
  }),
];
