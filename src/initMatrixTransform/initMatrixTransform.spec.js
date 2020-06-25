import { expect } from "chai";
import {
  each,
  equals2,
  go,
  map,
  mapL,
  rangeL,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import {
  makeRandomSVGMatrix,
  makeRandomNumber,
  makeRandomInt,
  deepCopyTransformList,
  makeRandomTransformAttributeValue,
  makeMockRect,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import {
  $$initMatrixTransform,
  $$initMatrixTransform2,
  $$initMatrixTransform3,
} from "./initMatrixTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

export default ({ describe, it }) => [
  describe(`$$initMatrixTransform`, function () {
    it(`The length of the SVG transform list is increased by 1.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [
          { $el: $el1, index: index1 },
          { $el: $el2, index: index2 },
          { $el: $el3, index: index3 },
        ] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );
        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );
        const [before_length1, before_length2, before_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        $$initMatrixTransform($svg)($el1, { matrix: matrix1, index: index1 });
        $$initMatrixTransform2({ matrix: matrix2, index: index2 })($el2, $svg);
        $$initMatrixTransform3({ matrix: matrix3, index: index3 }, $el3, $svg);

        const [after_length1, after_length2, after_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        each(
          ([before_length, after_length]) =>
            expect(after_length).equal(before_length + 1),
          [
            [before_length1, after_length1],
            [before_length2, after_length2],
            [before_length3, after_length3],
          ]
        );
      }
    });

    it(`The transform at input index is a matrix transform with the input matrix.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [
          { $el: $el1, index: index1 },
          { $el: $el2, index: index2 },
          { $el: $el3, index: index3 },
        ] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );
        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );

        $$initMatrixTransform($svg)($el1, { matrix: matrix1, index: index1 });
        $$initMatrixTransform2({ matrix: matrix2, index: index2 })($el2, $svg);
        $$initMatrixTransform3({ matrix: matrix3, index: index3 }, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index))
        );
        each(
          ([transform, matrix]) => expect(transform.matrix).deep.equal(matrix),
          [
            [transform1, matrix1],
            [transform2, matrix2],
            [transform3, matrix3],
          ]
        );
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [
          { $el: $el1, index: index1 },
          { $el: $el2, index: index2 },
          { $el: $el3, index: index3 },
        ] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );
        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );
        const [
          before_transform_list1,
          before_transform_list2,
          before_transform_list3,
        ] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(deepCopyTransformList)
        );

        $$initMatrixTransform($svg)($el1, { matrix: matrix1, index: index1 });
        $$initMatrixTransform2({ matrix: matrix2, index: index2 })($el2, $svg);
        $$initMatrixTransform3({ matrix: matrix3, index: index3 }, $el3, $svg);

        const [
          after_transform_list1,
          after_transform_list2,
          after_transform_list3,
        ] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(deepCopyTransformList)
        );

        each(
          ([before_transform_list, after_transform_list, index]) =>
            expect(
              go(
                after_transform_list,
                zipWithIndexL,
                rejectL(([i]) => equals2(index, i)),
                map(([, transform]) => transform)
              )
            ).deep.equal(before_transform_list),
          [
            [before_transform_list1, after_transform_list1, index1],
            [before_transform_list2, after_transform_list2, index2],
            [before_transform_list3, after_transform_list3, index3],
          ]
        );
      }
    });

    it(`The transform at input index is an identity matrix when there is no input matrix.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [
          { $el: $el1, index: index1 },
          { $el: $el2, index: index2 },
          { $el: $el3, index: index3 },
        ] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );

        $$initMatrixTransform($svg)($el1, { index: index1 });
        $$initMatrixTransform2({ index: index2 })($el2, $svg);
        $$initMatrixTransform3({ index: index3 }, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index))
        );

        each(
          (transform) =>
            expect(transform.matrix).deep.equal($$createSVGMatrix()()),
          [transform1, transform2, transform3]
        );
      }
    });

    it(`The transform is at index 0 when there is no input index.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [{ $el: $el1 }, { $el: $el2 }, { $el: $el3 }] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );
        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );

        $$initMatrixTransform($svg)($el1, { matrix: matrix1 });
        $$initMatrixTransform2({ matrix: matrix2 })($el2, $svg);
        $$initMatrixTransform3({ matrix: matrix3 }, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL((transform_list) => transform_list.getItem(0))
        );

        go(
          [transform1, transform2, transform3],
          zipL([matrix1, matrix2, matrix3]),
          each(([matrix, transform]) =>
            expect(transform.matrix).deep.equal(matrix)
          )
        );
      }
    });

    it(`The transform at index 0 is an identity matrix when there is no input object.`, function () {
      const $list_svg = [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ];

      for (const $svg of $list_svg) {
        const [{ $el: $el1 }, { $el: $el2 }, { $el: $el3 }] = mapL(
          () =>
            setupMockEl({
              transform: makeRandomTransformAttributeValue(),
            }),
          rangeL(3)
        );

        $$initMatrixTransform($svg)($el1);
        $$initMatrixTransform2()($el2, $svg);
        $$initMatrixTransform3(undefined, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL((transform_list) => transform_list.getItem(0))
        );

        each(
          (transform) =>
            expect(transform.matrix).deep.equal($$createSVGMatrix()()),
          [transform1, transform2, transform3]
        );
      }
    });
  }),
];
