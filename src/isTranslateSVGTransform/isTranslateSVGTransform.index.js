export const $$isTranslateSVGTransform = (transform) => {
  if (!(transform instanceof SVGTransform)) {
    throw new Error("It's not a SVGTransform.");
  }

  const { type, SVG_TRANSFORM_TRANSLATE } = transform;
  return type === SVG_TRANSFORM_TRANSLATE;
};
