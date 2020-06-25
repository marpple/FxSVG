import { expect } from "chai";
import {
  each,
  flatL,
  flatMapL,
  go,
  map,
  mapL,
  rangeL,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import {
  makeRandomTransformAttributeValue,
  makeRandomNumber,
  deepCopyTransformList,
  makeRandomInt,
  makeMockRect,
} from "../../test/utils/index.js";
import {
  expectTransformWithScaleSxSy,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import {
  $$initScaleTransform,
  $$initScaleTransform2,
  $$initScaleTransform3,
} from "./initScaleTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  sx: makeRandomNumber(-100, 100),
  sy: makeRandomNumber(-100, 100),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initScaleTransform`, function () {
    it(`The length of the SVG transform list is increased by 3.`, function () {
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));
        const [before_length1, before_length2, before_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        const [after_length1, after_length2, after_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        go(
          [after_length1, after_length2, after_length3],
          zipL([before_length1, before_length2, before_length3]),
          each(([before_length, after_length]) =>
            expect(after_length).equal(before_length + 3)
          )
        );
      }
    });

    it(`The transform at input index is a translate transform with tx = input cx, ty = input cy.`, function () {
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index)),
          zipL([
            [cx1, cy1],
            [cx2, cy2],
            [cx3, cy3],
          ]),
          mapL(flatL),
          mapL(([cx, cy, transform]) => ({ transform, tx: cx, ty: cy })),
          each(expectTransformWithTranslateTxTy)
        );
      }
    });

    it(`The transform at input index + 1 is a scale transform with input sx, sy.`, function () {
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index + 1)),
          zipL([
            [sx1, sy1],
            [sx2, sy2],
            [sx3, sy3],
          ]),
          mapL(flatL),
          mapL(([sx, sy, transform]) => ({ transform, sx, sy })),
          each(expectTransformWithScaleSxSy)
        );
      }
    });

    it(`The transform at input index + 2 is a translate transform with tx = -input cx, ty = -input cy.`, function () {
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index + 2)),
          zipL([
            [cx1, cy1],
            [cx2, cy2],
            [cx3, cy3],
          ]),
          mapL(flatL),
          mapL(([cx, cy, transform]) => ({ transform, tx: -cx, ty: -cy })),
          each(expectTransformWithTranslateTxTy)
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));
        const [
          before_transform_list1,
          before_transform_list2,
          before_transform_list3,
        ] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(deepCopyTransformList)
        );

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        const [
          after_transform_list1,
          after_transform_list2,
          after_transform_list3,
        ] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(deepCopyTransformList)
        );

        go(
          [after_transform_list1, after_transform_list2, after_transform_list3],
          zipL([
            before_transform_list1,
            before_transform_list2,
            before_transform_list3,
          ]),
          zipL([index1, index2, index3]),
          mapL(flatL),
          each(([index, before_transform_list, after_transform_list]) =>
            expect(
              go(
                after_transform_list,
                zipWithIndexL,
                rejectL(([i]) => i >= index && i <= index + 2),
                map(([, transform]) => transform)
              )
            ).deep.equal(before_transform_list)
          )
        );
      }
    });

    it(`The transforms at input index and input index + 2 are translate transforms with tx = 0, ty = 0
        when there are no input cx, cy.`, function () {
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
        const [
          { sx: sx1, sy: sy1 },
          { sx: sx2, sy: sy2 },
          { sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          index: index1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            index: index3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          flatMapL(([index, transform_list]) =>
            mapL((index) => transform_list.getItem(index), [index, index + 2])
          ),
          mapL((transform) => ({ transform, tx: 0, ty: 0 })),
          each(expectTransformWithTranslateTxTy)
        );
      }
    });

    it(`The transform at input index + 1 is a scale transform with sx = 1, sy = 1
        when there is no input sx, sy.`, function () {
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
        const [
          { cx: cx1, cy: cy1 },
          { cx: cx2, cy: cy2 },
          { cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initScaleTransform2({
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index + 1)),
          mapL((transform) => ({ transform, sx: 1, sy: 1 })),
          each(expectTransformWithScaleSxSy)
        );
      }
    });

    it(`The transform is from index 0 to index 2 when there is no input index.`, function () {
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
        const [
          { cx: cx1, cy: cy1, sx: sx1, sy: sy1 },
          { cx: cx2, cy: cy2, sx: sx2, sy: sy2 },
          { cx: cx3, cy: cy3, sx: sx3, sy: sy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initScaleTransform($svg)($el1, {
          sx: sx1,
          sy: sy1,
          cx: cx1,
          cy: cy1,
        });
        $$initScaleTransform2({
          sx: sx2,
          sy: sy2,
          cx: cx2,
          cy: cy2,
        })($el2, $svg);
        $$initScaleTransform3(
          {
            sx: sx3,
            sy: sy3,
            cx: cx3,
            cy: cy3,
          },
          $el3,
          $svg
        );

        go(
          [$el1, $el2, $el3],
          zipL([
            [cx1, cy1, sx1, sy1],
            [cx2, cy2, sx2, sy2],
            [cx3, cy3, sx3, sy3],
          ]),
          mapL(flatL),
          each(([cx, cy, sx, sy, $el]) => {
            expectTransformWithTranslateTxTy({
              transform: $$getBaseTransformList($el).getItem(0),
              tx: cx,
              ty: cy,
            });
            expectTransformWithScaleSxSy({
              transform: $$getBaseTransformList($el).getItem(1),
              sx,
              sy,
            });
            expectTransformWithTranslateTxTy({
              transform: $$getBaseTransformList($el).getItem(2),
              tx: -cx,
              ty: -cy,
            });
          })
        );
      }
    });

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a scale transform with sx = 1, sy = 1
        when there is no input object.`, function () {
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

        $$initScaleTransform($svg)($el1);
        $$initScaleTransform2()($el2, $svg);
        $$initScaleTransform3(undefined, $el3, $svg);

        each(
          ($el) => {
            expectTransformWithTranslateTxTy({
              transform: $$getBaseTransformList($el).getItem(0),
              tx: 0,
              ty: 0,
            });
            expectTransformWithScaleSxSy({
              transform: $$getBaseTransformList($el).getItem(1),
              sx: 1,
              sy: 1,
            });
            expectTransformWithTranslateTxTy({
              transform: $$getBaseTransformList($el).getItem(2),
              tx: 0,
              ty: 0,
            });
          },
          [$el1, $el2, $el3]
        );
      }
    });
  }),
];
