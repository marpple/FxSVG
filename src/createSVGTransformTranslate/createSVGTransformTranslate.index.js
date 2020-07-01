import { tap } from "fxjs2";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformTranslate = ({ tx = 0, ty = 0 } = {}) => (
  $svg = $$getSVG()
) =>
  tap((transform) => transform.setTranslate(tx, ty))(
    $$createSVGTransform($svg)
  );
