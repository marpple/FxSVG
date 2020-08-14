import { reduce } from "fxjs2";

export const $$getBoundingPoints = (points = []) =>
  reduce(
    (acc, { x, y }) => {
      acc[0].x = Math.min(acc[0].x, x);
      acc[0].y = Math.min(acc[0].y, y);
      acc[1].x = Math.max(acc[1].x, x);
      acc[1].y = Math.max(acc[1].y, y);
      return acc;
    },
    [
      { x: Infinity, y: Infinity },
      { x: -Infinity, y: -Infinity },
    ],
    points
  );
