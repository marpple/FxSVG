import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";

export const $$isTranslateSVGTransform = (transform) => {
  if (!$$isSVGTransform(transform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_TRANSLATE } = transform;
  return type === SVG_TRANSFORM_TRANSLATE;
};
