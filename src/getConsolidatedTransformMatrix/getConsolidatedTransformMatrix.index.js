import { go, rangeL, mapL, reduce, defaultTo } from "fxjs";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$getConsolidatedTransformMatrix = (
  transform_list = [],
  $svg = $$getSVG()
) =>
  go(
    rangeL(transform_list.numberOfItems),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix }) => matrix),
    reduce((m1, m2) => m1.multiply(m2)),
    defaultTo($$createSVGMatrix({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })($svg))
  );
