import { curry } from "fxjs2";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";

export const $$updateMatrixTransform = (transform, { matrix } = {}) => {
  if (!$$isMatrixSVGTransform(transform)) {
    return transform;
  }

  matrix && transform.setMatrix(matrix);
  return transform;
};

export const $$updateMatrixTransform2 = ({ matrix } = {}) => (transform) => {
  if (!$$isMatrixSVGTransform(transform)) {
    return transform;
  }

  matrix && transform.setMatrix(matrix);
  return transform;
};

export const $$updateMatrixTransform3 = curry(({ matrix } = {}, transform) => {
  if (!$$isMatrixSVGTransform(transform)) {
    return transform;
  }

  matrix && transform.setMatrix(matrix);
  return transform;
});
