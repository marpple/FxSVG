import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";

export const $$isScaleSVGTransform = (transform) => {
  if (!$$isSVGTransform(transform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_SCALE } = transform;
  return type === SVG_TRANSFORM_SCALE;
};
