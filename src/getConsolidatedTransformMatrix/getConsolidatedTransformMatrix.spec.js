import chai from "chai";
import { go, join, mapL, rangeL } from "fxjs/es";
import { expectSameValueSVGMatrix } from "../../test/assertions/expectSameValueSVGMatrix.js";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$consolidateTransformList } from "../consolidateTransformList/consolidateTransformList.index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getConsolidatedTransformMatrix } from "./getConsolidatedTransformMatrix.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$getConsolidatedTransformMatrix`, function () {
    it(`The function returns the consolidated matrix of the transform list.`, function () {
      // given
      const el = go(
        makeRandomInt(1, 10),
        rangeL,
        mapL(() =>
          go(
            rangeL(6),
            mapL(() => makeRandomInt(-10, 10)),
            mapL((i) => `${i}`),
            join(" "),
            (str) => `matrix(${str})`
          )
        ),
        join(" "),
        (transform) => makeMockRect({ transform })
      );
      const transform_list = $$getBaseTransformList(el);
      const { matrix: expect_matrix } = $$consolidateTransformList(
        $$getBaseTransformList(el.cloneNode(true))
      ).getItem(0);

      // when
      const receive_matrix = $$getConsolidatedTransformMatrix(transform_list);

      // then
      expectSameValueSVGMatrix(receive_matrix, expect_matrix);
    });

    it(`The function returns an identity matrix when the transform list is empty.`, function () {
      // given
      const el = $$el(`<circle cx="0" cy="0" r="10"></circle>`)();
      const transform_list = $$getBaseTransformList(el);
      const expect_matrix = $$createSVGMatrix()();

      // when
      const receive_matrix = $$getConsolidatedTransformMatrix(transform_list);

      // then
      expect(receive_matrix).deep.equal(expect_matrix);
    });
  }),
];
