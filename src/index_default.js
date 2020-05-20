import { $$getSVG, $$setSVG } from "./getSetSVG.js";
import { $$els } from "./els.js";
import { $$el } from "./el.js";
import { $$createSVGPoint } from "./createSVGPoint.js";
import { $$createSVGRect } from "./createSVGRect.js";
import { $$createSVGMatrix } from "./createSVGMatrix.js";
import { $$createSVGTransform } from "./createSVGTransform.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.js";
import { $$isRotateSVGTransform } from "./isRotateSVGTransform.js";

const FxSVG = {
  getSVG: $$getSVG,
  setSVG: $$setSVG,
  els: $$els,
  el: $$el,
  createSVGPoint: $$createSVGPoint,
  createSVGRect: $$createSVGRect,
  createSVGMatrix: $$createSVGMatrix,
  createSVGTransform: $$createSVGTransform,
  createSVGTransformTranslate: $$createSVGTransformTranslate,
  createSVGTransformRotate: $$createSVGTransformRotate,
  createSVGTransformScale: $$createSVGTransformScale,
  createSVGTransformMatrix: $$createSVGTransformMatrix,
  isTranslateSVGTransform: $$isTranslateSVGTransform,
  isRotateSVGTransform: $$isRotateSVGTransform,
};

export default FxSVG;
