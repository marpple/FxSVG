export const $$isTranslateSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_TRANSLATE } = transform;
  return type === SVG_TRANSFORM_TRANSLATE;
};
