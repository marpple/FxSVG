import { defaultTo } from "fxjs/es";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";

export const $$updateScaleTransform = ({ sx, sy } = {}) => (transform) => {
  if (!$$isScaleSVGTransform(transform)) {
    return transform;
  }

  transform.setScale(
    defaultTo(transform.matrix.a, sx),
    defaultTo(transform.matrix.d, sy)
  );
  return transform;
};
