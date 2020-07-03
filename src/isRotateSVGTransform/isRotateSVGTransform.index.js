import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";

export const $$isRotateSVGTransform = (transform) => {
  if (!$$isSVGTransform(transform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_ROTATE } = transform;
  return type === SVG_TRANSFORM_ROTATE;
};
