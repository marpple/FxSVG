import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$appendRotateTransform = (transform, { angle }) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }
  transform.setRotate(transform.angle + angle, 0, 0);
  return transform;
};