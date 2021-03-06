import {
  $after,
  $append,
  $appendTo,
  $before,
  $closest,
  $contains,
  $hide,
  $insertAfter,
  $insertBefore,
  $off,
  $on,
  $prepend,
  $prependTo,
  $qs,
  $qsa,
  $remove,
  $show,
  $trigger,
} from "fxdom/es";
import { $$appendRotateTransform } from "./appendRotateTransform/appendRotateTransform.index.js";
import { $$appendTranslateTransform } from "./appendTranslateTransform/appendTranslateTransform.index.js";
import { $$consolidateTransformList } from "./consolidateTransformList/consolidateTransformList.index.js";
import { $$convertClientToUserCoords } from "./convertClientToUserCoords/convertClientToUserCoords.index.js";
import { $$createSVGMatrix } from "./createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGPoint } from "./createSVGPoint/createSVGPoint.index.js";
import { $$createSVGRect } from "./createSVGRect/createSVGRect.index.js";
import { $$createSVGTransform } from "./createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "./el/el.index.js";
import { $$els } from "./els/els.index.js";
import { CustomError } from "./Errors/CustomError.js";
import { IllegalArgumentError } from "./Errors/IllegalArgumentError.js";
import { $$getAnimTransformList } from "./getAnimTransformList/getAnimTransformList.index.js";
import { $$getAttrNS } from "./getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "./getBaseTransformList/getBaseTransformList.index.js";
import { $$getBoundingPoints } from "./getBoundingPoints/getBoundingPoints.index.js";
import { $$getBoxPoints } from "./getBoxPoints/getBoxPoints.index.js";
import { $$getCenterPoint } from "./getCenterPoint/getCenterPoint.index.js";
import { $$getConsolidatedTransformMatrix } from "./getConsolidatedTransformMatrix/getConsolidatedTransformMatrix.index.js";
import { $$getSVG, $$setSVG } from "./getSetSVG/getSetSVG.index.js";
import { $$hasAttrNS } from "./hasAttrNS/hasAttrNS.index.js";
import { $$initMatrixTransform } from "./initMatrixTransform/initMatrixTransform.index.js";
import { $$initRotateTransform } from "./initRotateTransform/initRotateTransform.index.js";
import { $$initScaleTransform } from "./initScaleTransform/initScaleTransform.index.js";
import { $$initTranslateTransform } from "./initTranslateTransform/initTranslateTransform.index.js";
import { $$isIdentityMatrix } from "./isIdentityMatrix/isIdentityMatrix.index.js";
import { $$isMatrixSVGTransform } from "./isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { $$isRotateSVGTransform } from "./isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isScaleSVGTransform } from "./isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$isSVGTransform } from "./isSVGTransform/isSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$isValidFxScaleSVGTransformList } from "./isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.index.js";
import {
  $$joinPathData,
  $$toStringPathCommandParameters,
} from "./joinPathData/joinPathData.index.js";
import { $$LiveRotateTransform } from "./LiveRotateTransform/LiveRotateTransform.index.js";
import { $$LiveScaleTransform } from "./LiveScaleTransform/LiveScaleTransform.index.js";
import { $$LiveScaleTransform2 } from "./LiveScaleTransform2/LiveScaleTransform2.index.js";
import { $$LiveTransform } from "./LiveTransform/LiveTransform.index.js";
import { $$LiveTransformHandler } from "./LiveTransformHandler/LiveTransformHandler.index.js";
import { $$LiveTranslateTransform } from "./LiveTranslateTransform/LiveTranslateTransform.index.js";
import { $$mergeRotateTransform } from "./mergeRotateTransform/mergeRotateTransform.index.js";
import { $$mergeScaleTransform } from "./mergeScaleTransform/mergeScaleTransform.index.js";
import { $$mergeScaleTransform2 } from "./mergeScaleTransform2/mergeScaleTransform2.index.js";
import { $$mergeTranslateTransform } from "./mergeTranslateTransform/mergeTranslateTransform.index.js";
import {
  $$compressPathCommandL,
  $$convertPathCommandParametersRelativeToAbsoluteL,
  $$flatPathCommandParametersL,
  $$parsePathCommandParameters,
  $$parsePathDateL,
  $$splitPathDataByCommandL,
} from "./parsePathData/parsePathData.index.js";
import { $$removeAttrNS } from "./removeAttrNS/removeAttrNS.index.js";
import { $$setAttrNS } from "./setAttrNS/setAttrNS.index.js";
import { $$updateMatrixTransform } from "./updateMatrixTransform/updateMatrixTransform.index.js";
import { $$updateRotateTransform } from "./updateRotateTransform/updateRotateTransform.index.js";
import { $$updateScaleTransform } from "./updateScaleTransform/updateScaleTransform.index.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform/updateTranslateTransform.index.js";

export const FxSVG = {
  after: $after,
  append: $append,
  appendTo: $appendTo,
  before: $before,
  closest: $closest,
  contains: $contains,
  hide: $hide,
  insertAfter: $insertAfter,
  insertBefore: $insertBefore,
  off: $off,
  on: $on,
  prepend: $prepend,
  prependTo: $prependTo,
  qs: $qs,
  qsa: $qsa,
  remove: $remove,
  show: $show,
  trigger: $trigger,

  CustomError,
  InvalidArgumentsError: IllegalArgumentError,

  appendRotateTransform: $$appendRotateTransform,
  appendTranslateTransform: $$appendTranslateTransform,
  consolidateTransformList: $$consolidateTransformList,
  convertClientToUserCoords: $$convertClientToUserCoords,
  createSVGMatrix: $$createSVGMatrix,
  createSVGPoint: $$createSVGPoint,
  createSVGRect: $$createSVGRect,
  createSVGTransform: $$createSVGTransform,
  createSVGTransformMatrix: $$createSVGTransformMatrix,
  createSVGTransformRotate: $$createSVGTransformRotate,
  createSVGTransformScale: $$createSVGTransformScale,
  createSVGTransformTranslate: $$createSVGTransformTranslate,
  el: $$el,
  els: $$els,
  getAnimTransformList: $$getAnimTransformList,
  getAttrNS: $$getAttrNS,
  getBaseTransformList: $$getBaseTransformList,
  getBoundingPoints: $$getBoundingPoints,
  getBoxPoints: $$getBoxPoints,
  getCenterPoint: $$getCenterPoint,
  getConsolidatedTransformMatrix: $$getConsolidatedTransformMatrix,
  getSVG: $$getSVG,
  setSVG: $$setSVG,
  hasAttrNS: $$hasAttrNS,
  initMatrixTransform: $$initMatrixTransform,
  initRotateTransform: $$initRotateTransform,
  initScaleTransform: $$initScaleTransform,
  initTranslateTransform: $$initTranslateTransform,
  isIdentityMatrix: $$isIdentityMatrix,
  isMatrixSVGTransform: $$isMatrixSVGTransform,
  isRotateSVGTransform: $$isRotateSVGTransform,
  isScaleSVGTransform: $$isScaleSVGTransform,
  isSVGTransform: $$isSVGTransform,
  isTranslateSVGTransform: $$isTranslateSVGTransform,
  isValidFxScaleSVGTransformList: $$isValidFxScaleSVGTransformList,
  toStringPathCommandParameters: $$toStringPathCommandParameters,
  joinPathData: $$joinPathData,
  LiveRotateTransform: $$LiveRotateTransform,
  LiveScaleTransform: $$LiveScaleTransform,
  LiveScaleTransform2: $$LiveScaleTransform2,
  LiveTransform: $$LiveTransform,
  LiveTransformHandler: $$LiveTransformHandler,
  LiveTranslateTransform: $$LiveTranslateTransform,
  mergeRotateTransform: $$mergeRotateTransform,
  mergeScaleTransform: $$mergeScaleTransform,
  mergeScaleTransform2: $$mergeScaleTransform2,
  mergeTranslateTransform: $$mergeTranslateTransform,
  splitPathDataByCommandL: $$splitPathDataByCommandL,
  parsePathCommandParameters: $$parsePathCommandParameters,
  convertPathCommandParametersRelativeToAbsoluteL: $$convertPathCommandParametersRelativeToAbsoluteL,
  compressPathCommandL: $$compressPathCommandL,
  parsePathDateL: $$parsePathDateL,
  flatPathCommandParametersL: $$flatPathCommandParametersL,
  removeAttrNS: $$removeAttrNS,
  setAttrNS: $$setAttrNS,
  updateMatrixTransform: $$updateMatrixTransform,
  updateRotateTransform: $$updateRotateTransform,
  updateScaleTransform: $$updateScaleTransform,
  updateTranslateTransform: $$updateTranslateTransform,
};
