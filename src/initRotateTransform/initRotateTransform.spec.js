import { expect } from "chai";
import {
  each,
  extend,
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
  expectTransformWithRotateAngleCxCy,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import {
  $$initRotateTransform,
  $$initRotateTransform2,
  $$initRotateTransform3,
} from "./initRotateTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  angle: makeRandomNumber(-700, 700),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initRotateTransform`, function () {
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));
        const [before_length1, before_length2, before_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index))
        );

        each(expectTransformWithTranslateTxTy, [
          { transform: transform1, tx: cx1, ty: cy1 },
          { transform: transform2, tx: cx2, ty: cy2 },
          { transform: transform3, tx: cx3, ty: cy3 },
        ]);
      }
    });

    it(`The transform at input index + 1 is a rotate transform with the input angle, cx = 0, cy = 0.`, function () {
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index + 1))
        );

        go(
          [
            { transform: transform1, angle: angle1 },
            { transform: transform2, angle: angle2 },
            { transform: transform3, angle: angle3 },
          ],
          mapL((o) => extend({ cx: 0, cy: 0 }, o)),
          each(expectTransformWithRotateAngleCxCy)
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
            cx: cx3,
            cy: cy3,
            index: index3,
          },
          $el3,
          $svg
        );

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index + 2))
        );

        each(expectTransformWithTranslateTxTy, [
          { transform: transform1, tx: -cx1, ty: -cy1 },
          { transform: transform2, tx: -cx2, ty: -cy2 },
          { transform: transform3, tx: -cx3, ty: -cy3 },
        ]);
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
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

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
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
        const [{ angle: angle1 }, { angle: angle2 }, { angle: angle3 }] = mapL(
          setupMockInputValues,
          rangeL(3)
        );

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          index: index1,
        });
        $$initRotateTransform2({
          angle: angle2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
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

    it(`The transform at input index + 1 is a rotate transform with angle = 0, cx = 0, cy = 0
        when there is no input angle.`, function () {
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

        $$initRotateTransform($svg)($el1, {
          cx: cx1,
          cy: cy1,
          index: index1,
        });
        $$initRotateTransform2({
          cx: cx2,
          cy: cy2,
          index: index2,
        })($el2, $svg);
        $$initRotateTransform3(
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
          mapL((transform) => ({ transform, angle: 0, cx: 0, cy: 0 })),
          each(expectTransformWithRotateAngleCxCy)
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
          { angle: angle1, cx: cx1, cy: cy1 },
          { angle: angle2, cx: cx2, cy: cy2 },
          { angle: angle3, cx: cx3, cy: cy3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initRotateTransform($svg)($el1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
        });
        $$initRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
        })($el2, $svg);
        $$initRotateTransform3(
          {
            angle: angle3,
            cx: cx3,
            cy: cy3,
          },
          $el3,
          $svg
        );

        const [transform_list1, transform_list2, transform_list3] = mapL(
          ($el) => $$getBaseTransformList($el),
          [$el1, $el2, $el3]
        );

        go(
          [transform_list1, transform_list2, transform_list3],
          mapL((transform_list) => transform_list.getItem(0)),
          zipL([
            [cx1, cy1],
            [cx2, cy2],
            [cx3, cy3],
          ]),
          mapL(flatL),
          mapL(([cx, cy, transform]) => ({ transform, tx: cx, ty: cy })),
          each(expectTransformWithTranslateTxTy)
        );
        go(
          [transform_list1, transform_list2, transform_list3],
          mapL((transform_list) => transform_list.getItem(1)),
          zipL([angle1, angle2, angle3]),
          mapL(([angle, transform]) => ({ transform, angle, cx: 0, cy: 0 })),
          each(expectTransformWithRotateAngleCxCy)
        );
        go(
          [transform_list1, transform_list2, transform_list3],
          mapL((transform_list) => transform_list.getItem(2)),
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

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a rotate transform with angle = 0, cx = 0, cy = 0
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

        $$initRotateTransform($svg)($el1);
        $$initRotateTransform2()($el2, $svg);
        $$initRotateTransform3(undefined, $el3, $svg);

        const [transform_list1, transform_list2, transform_list3] = mapL(
          ($el) => $$getBaseTransformList($el),
          [$el1, $el2, $el3]
        );

        go(
          [transform_list1, transform_list2, transform_list3],
          flatMapL((transform_list) =>
            mapL((index) => transform_list.getItem(index), [0, 2])
          ),
          mapL((transform) => ({ transform, tx: 0, ty: 0 })),
          each(expectTransformWithTranslateTxTy)
        );
        go(
          [transform_list1, transform_list2, transform_list3],
          mapL((transform_list) => transform_list.getItem(1)),
          mapL((transform) => ({ transform, angle: 0, cx: 0, cy: 0 })),
          each(expectTransformWithRotateAngleCxCy)
        );
      }
    });
  }),
];
