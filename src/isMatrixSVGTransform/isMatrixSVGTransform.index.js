import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";

export const $$isMatrixSVGTransform = (transform) => {
  if (!$$isSVGTransform(transform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_MATRIX } = transform;
  return type === SVG_TRANSFORM_MATRIX;
};
