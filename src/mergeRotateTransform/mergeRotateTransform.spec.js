import chai from "chai";
import { equals2, go, map, rejectL, zipL, zipWithIndexL } from "fxjs/es";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRectInitializedRotateTransform,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumberExcept,
  makeRandomSVGTransformMatrix,
  makeRandomSVGTransformRotate,
  makeRandomSVGTransformScale,
  makeRandomSVGTransformTranslate,
} from "../../test/utils/index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$mergeRotateTransform } from "./mergeRotateTransform.index.js";

const { expect } = chai;

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const expectSameValueTransformList = (
  receive_transform_list,
  expect_transform_list
) => {
  expect(receive_transform_list.length).equal(expect_transform_list.length);
  const pairs = zipL(receive_transform_list, expect_transform_list);
  for (const [receive_transform, expect_transform] of pairs) {
    expectSameValueSVGTransform(
      receive_transform,
      expect_transform,
      "expectSameTransformList"
    );
  }
};

export default ({ describe, it }) => [
  describe(`$$mergeRotateTransform`, function () {
    it(`The function do nothing but return the input element when the input index is out of bounds.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el: $input } = makeMockRectInitializedRotateTransform();
        const { numberOfItems: transform_list_length } = $$getBaseTransformList(
          $input
        );
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        const index = makeRandomBool()
          ? transform_list_length + makeRandomInt(1)
          : -makeRandomInt(1);

        const $output = $$mergeRotateTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list
        );
      }
    });

    describe(`The function do nothing but return the input element
              when the transform at input index - 1 is not a translate transform.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformMatrix(),
            index - 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
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
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformRotate(),
            index - 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
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
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformScale(),
            index - 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });
    });

    describe(`The function do nothing but return the input element
              when the transform at input index is not a rotate transform.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformMatrix(),
            index
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
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
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformScale(),
            index
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });

      it(`When the transform is a translate transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformTranslate(),
            index
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });
    });

    describe(`The function do nothing but return the input element
              when the transform at input index + 1 is not a translate transform.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        for (const $svg of setupSVGList()) {
          const {
            $el: $input,
            index,
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformMatrix(),
            index + 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
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
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformRotate(),
            index + 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
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
          } = makeMockRectInitializedRotateTransform();
          $$getBaseTransformList($input).removeItem(index - 1);
          $$getBaseTransformList($input).insertItemBefore(
            makeRandomSVGTransformScale(),
            index + 1
          );
          const before_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );

          const $output = $$mergeRotateTransform({ index })($input, $svg);

          const after_transform_list = deepCopyTransformList(
            $$getBaseTransformList($input)
          );
          expect($output).equal($input);
          expectSameValueTransformList(
            after_transform_list,
            before_transform_list
          );
        }
      });
    });

    it(`The function do nothing but return the input element
        when the cx, cy values of the transform at input index are not 0.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el: $input, index } = makeMockRectInitializedRotateTransform();
        const transform = $$getBaseTransformList($input).getItem(index);
        transform.setRotate(
          transform.angle,
          makeRandomNumberExcept(-100, 100, [0]),
          makeRandomNumberExcept(-100, 100, [0])
        );
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeRotateTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list
        );
      }
    });

    it(`The function do nothing but return the input element
        when the sum of tx values of the transforms at the input index - 1 and the input index + 1 is not 0.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el: $input, index } = makeMockRectInitializedRotateTransform();
        const target_index = index + (makeRandomBool() ? 1 : -1);
        const transform = $$getBaseTransformList($input).getItem(target_index);
        transform.setTranslate(
          transform.matrix.e + makeRandomNumberExcept(-100, 100, [0]),
          transform.matrix.f
        );
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeRotateTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list
        );
      }
    });

    it(`The function do nothing but return the input element
        when the sum of ty values of the transforms at the input index - 1 and the input index + 1 is not 0.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el: $input, index } = makeMockRectInitializedRotateTransform();
        const target_index = index + (makeRandomBool() ? 1 : -1);
        const transform = $$getBaseTransformList($input).getItem(target_index);
        transform.setTranslate(
          transform.matrix.e,
          transform.matrix.f + makeRandomNumberExcept(-100, 100, [0])
        );
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeRotateTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list
        );
      }
    });

    it(`The transform "translate(cx, cy)" at the input index - 1,
        the transform "rotate(angle, 0, 0)" at the input index,
        the transform "translate(-cx, -cy)" at the input index + 1
        are merge to the transform "rotate(angle, cx, cy)"
        So the length of the transform list is decreased by 2.`, function () {
      for (const $svg of setupSVGList()) {
        const {
          $el: $input,
          index,
          angle,
          cx,
          cy,
        } = makeMockRectInitializedRotateTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeRotateTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        expect(after_transform_list.length).equal(
          before_transform_list.length - 2
        );
        const expect_transform_list = go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(i, index - 1) || equals2(i, index + 1)),
          map(([i, transform]) => {
            if (equals2(i, index)) {
              return $$createSVGTransformRotate({ angle, cx, cy })();
            }
            return transform;
          })
        );
        expectSameValueTransformList(
          after_transform_list,
          expect_transform_list
        );
      }
    });
  }),
];
