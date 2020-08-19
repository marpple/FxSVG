import { every } from "fxjs2";

export const $$isIdentityMatrix = ({ a, b, c, d, e, f } = {}) =>
  every(([x, y]) => Number.isFinite(x) && Math.abs(x - y) < Number.EPSILON, [
    [a, 1],
    [b, 0],
    [c, 0],
    [d, 1],
    [e, 0],
    [f, 0],
  ]);
