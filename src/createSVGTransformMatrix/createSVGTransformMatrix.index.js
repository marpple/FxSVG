import { defaultTo } from "fxjs2";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformMatrix = ($svg = $$getSVG()) => ({
  matrix = $$createSVGMatrix($svg)(),
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};

export const $$createSVGTransformMatrix2 = ({ matrix } = {}) => (
  $svg = $$getSVG()
) => {
  matrix = defaultTo($$createSVGMatrix($svg)(), matrix);

  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};

export const $$createSVGTransformMatrix3 = (
  { matrix } = {},
  $svg = $$getSVG()
) => {
  matrix = defaultTo($$createSVGMatrix($svg)(), matrix);

  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};
