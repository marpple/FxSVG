export const $$isRotateSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_ROTATE } = transform;
  return type === SVG_TRANSFORM_ROTATE;
};
