import { isNil } from "fxjs2";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$appendRotateTransform = (transform, { angle }) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  if (isNil(angle)) {
    throw new Error("There is no angle.");
  }

  transform.setRotate(transform.angle + angle, 0, 0);
  return transform;
};
