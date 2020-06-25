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
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { expectTransformWithTranslateTxTy } from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import {
  $$initTranslateTransform,
  $$initTranslateTransform2,
  $$initTranslateTransform3,
} from "./initTranslateTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  tx: makeRandomNumber(-100, 100),
  ty: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initTranslateTransform`, function () {
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
        const [
          { tx: tx1, ty: ty1 },
          { tx: tx2, ty: ty2 },
          { tx: tx3, ty: ty3 },
        ] = mapL(setupMockInputValues, rangeL(3));
        const [before_length1, before_length2, before_length3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL(({ numberOfItems }) => numberOfItems)
        );

        $$initTranslateTransform($svg)($el1, {
          tx: tx1,
          ty: ty1,
          index: index1,
        });
        $$initTranslateTransform2({
          tx: tx2,
          ty: ty2,
          index: index2,
        })($el2, $svg);
        $$initTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
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
            expect(after_length).equal(before_length + 1)
          )
        );
      }
    });

    it(`The transform at input index is a translate transform with the input tx, ty.`, function () {
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
          { tx: tx1, ty: ty1 },
          { tx: tx2, ty: ty2 },
          { tx: tx3, ty: ty3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initTranslateTransform($svg)($el1, {
          tx: tx1,
          ty: ty1,
          index: index1,
        });
        $$initTranslateTransform2({
          tx: tx2,
          ty: ty2,
          index: index2,
        })($el2, $svg);
        $$initTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
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
          { transform: transform1, tx: tx1, ty: ty1 },
          { transform: transform2, tx: tx2, ty: ty2 },
          { transform: transform3, tx: tx3, ty: ty3 },
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
          { tx: tx1, ty: ty1 },
          { tx: tx2, ty: ty2 },
          { tx: tx3, ty: ty3 },
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

        $$initTranslateTransform($svg)($el1, {
          tx: tx1,
          ty: ty1,
          index: index1,
        });
        $$initTranslateTransform2({
          tx: tx2,
          ty: ty2,
          index: index2,
        })($el2, $svg);
        $$initTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
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

    it(`The transform at input index is a translate transform with tx = 0, ty = 0
        when there is no input tx, ty.`, function () {
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

        $$initTranslateTransform($svg)($el1, { index: index1 });
        $$initTranslateTransform2({ index: index2 })($el2, $svg);
        $$initTranslateTransform3({ index: index3 }, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          zipL([index1, index2, index3]),
          mapL(([index, transform_list]) => transform_list.getItem(index))
        );

        each(
          (transform) =>
            expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 }),
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
        const [
          { tx: tx1, ty: ty1 },
          { tx: tx2, ty: ty2 },
          { tx: tx3, ty: ty3 },
        ] = mapL(setupMockInputValues, rangeL(3));

        $$initTranslateTransform($svg)($el1, { tx: tx1, ty: ty1 });
        $$initTranslateTransform2({ tx: tx2, ty: ty2 })($el2, $svg);
        $$initTranslateTransform3({ tx: tx3, ty: ty3 }, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL((transform_list) => transform_list.getItem(0))
        );

        each(expectTransformWithTranslateTxTy, [
          { transform: transform1, tx: tx1, ty: ty1 },
          { transform: transform2, tx: tx2, ty: ty2 },
          { transform: transform3, tx: tx3, ty: ty3 },
        ]);
      }
    });

    it(`The transform at index 0 is a translate transform when there is no input object.`, function () {
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

        $$initTranslateTransform($svg)($el1);
        $$initTranslateTransform2()($el2, $svg);
        $$initTranslateTransform3(undefined, $el3, $svg);

        const [transform1, transform2, transform3] = go(
          [$el1, $el2, $el3],
          mapL($$getBaseTransformList),
          mapL((transform_list) => transform_list.getItem(0))
        );

        each(
          (transform) =>
            expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 }),
          [transform1, transform2, transform3]
        );
      }
    });
  }),
];
