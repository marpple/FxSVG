import { expect } from "chai";
import { defaultTo, each, equals2, go, join, mapL, rangeL, zipL } from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  makeMockRect,
  makeRandomInt,
  makeRandomTransformString,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getAnimTransformList } from "./getAnimTransformList.index.js";

export default ({ describe, it }) => [
  describe(`$$getAnimTransformList`, function () {
    it(`The return transform list is same with the base transform list if there is no animation.`, function () {
      const { base_transform_list, anim_transform_list } = go(
        makeRandomInt(),
        rangeL,
        mapL(() => makeRandomInt(0, 3)),
        mapL((flag) => {
          if (equals2(flag, 1)) {
            return `skewX(${makeRandomInt(-700, 700)})`;
          }

          if (equals2(flag, 2)) {
            return `skewY(${makeRandomInt(-700, 700)})`;
          }

          return makeRandomTransformString(() => makeRandomInt(-700, 700));
        }),
        join(" "),
        defaultTo(null),
        (transform) => makeMockRect({ transform }),
        ($el) => ({
          base_transform_list: [...$$getBaseTransformList($el)],
          anim_transform_list: [...$$getAnimTransformList($el)],
        })
      );

      expect(anim_transform_list.length).equal(base_transform_list.length);
      go(
        anim_transform_list,
        zipL(base_transform_list),
        each(([base_transform, anim_transform]) =>
          expectSameValueSVGTransform(anim_transform, base_transform)
        )
      );
    });
  }),
];
