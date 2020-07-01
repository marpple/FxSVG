import { tap } from "fxjs2";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformScale = ({ sx = 1, sy = 1 } = {}) => (
  $svg = $$getSVG()
) => tap((transform) => transform.setScale(sx, sy))($$createSVGTransform($svg));
