import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";

export const $$updateMatrixTransform = (transform, { matrix } = {}) => {
  if (!$$isMatrixSVGTransform(transform)) {
    return transform;
  }

  matrix && transform.setMatrix(matrix);
  return transform;
};
