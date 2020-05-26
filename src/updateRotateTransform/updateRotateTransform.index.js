import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$updateRotateTransform = (transform, { angle }) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  if (angle == null) {
    throw new Error("There is no angle.");
  }

  transform.setRotate(angle, 0, 0);
  return transform;
};
