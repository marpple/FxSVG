import { defaultTo, tap } from "fxjs2";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformMatrix = ({ matrix } = {}) => (
  $svg = $$getSVG()
) =>
  tap((transform) =>
    transform.setMatrix(defaultTo($$createSVGMatrix()($svg), matrix))
  )($$createSVGTransform($svg));
