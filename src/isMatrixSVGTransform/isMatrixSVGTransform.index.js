export const $$isMatrixSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    return false;
  }

  const { type, SVG_TRANSFORM_MATRIX } = transform;
  return type === SVG_TRANSFORM_MATRIX;
};
