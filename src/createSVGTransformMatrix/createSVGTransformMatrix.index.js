import { defaultTo } from "fxjs/es";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformMatrix = ({ matrix } = {}) => (
  $svg = $$getSVG()
) => {
  const transform = $$createSVGTransform($svg);
  transform.setMatrix(defaultTo($$createSVGMatrix()($svg), matrix));
  return transform;
};
