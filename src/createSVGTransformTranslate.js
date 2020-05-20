import { $$createSVGTransform } from "./createSVGTransform.js";

export const $$createSVGTransformTranslate = ({ tx = 0, ty = 0 } = {}) => {
  const transform = $$createSVGTransform();
  transform.setTranslate(tx, ty);
  return transform;
};
