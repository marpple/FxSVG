import { defaultTo } from "fxjs/es";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";

export const $$updateMatrixTransform = ({ matrix } = {}) => (transform) => {
  if (!$$isMatrixSVGTransform(transform)) {
    return transform;
  }

  transform.setMatrix(defaultTo(transform.matrix, matrix));
  return transform;
};
