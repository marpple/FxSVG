import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$updateRotateTransform = (transform, { angle }) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }
  transform.setRotate(angle, 0, 0);
  return transform;
};
