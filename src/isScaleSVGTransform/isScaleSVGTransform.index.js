export const $$isScaleSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_SCALE } = transform;
  return type === SVG_TRANSFORM_SCALE;
};
