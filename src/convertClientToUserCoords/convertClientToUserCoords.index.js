import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";

export const $$convertClientToUserCoords = ({
  x: client_x = 0,
  y: client_y = 0,
} = {}) => ($svg) =>
  $$createSVGPoint({ x: client_x, y: client_y })($svg).matrixTransform(
    $svg.getScreenCTM().inverse()
  );
