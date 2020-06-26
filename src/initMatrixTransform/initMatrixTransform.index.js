import { curry, defaultTo } from "fxjs2";
import {
  $$createSVGMatrix,
  $$createSVGMatrix2,
} from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initMatrixTransform = ($svg = $$getSVG()) => (
  $el,
  { matrix = $$createSVGMatrix($svg)(), index = 0 } = {}
) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformMatrix($svg)({ matrix }),
    index
  );

export const $$initMatrixTransform2 = ({ matrix, index = 0 } = {}) => (
  $el,
  $svg = $$getSVG()
) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformMatrix($svg)({
      matrix: defaultTo($$createSVGMatrix2()($svg), matrix),
    }),
    index
  );

export const $$initMatrixTransform3 = curry(
  ({ matrix, index = 0 } = {}, $el, $svg = $$getSVG()) =>
    $$getBaseTransformList($el).insertItemBefore(
      $$createSVGTransformMatrix($svg)({
        matrix: defaultTo($$createSVGMatrix2()($svg), matrix),
      }),
      index
    )
);
