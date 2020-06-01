export const $$isScaleSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    throw new Error("It's not a SVGTransform.");
  }

  const { type, SVG_TRANSFORM_SCALE } = transform;
  return type === SVG_TRANSFORM_SCALE;
};
