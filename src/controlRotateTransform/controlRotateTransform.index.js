import {$$appendRotateTransform} from "../appendRotateTransform/appendRotateTransform.index.js";
import {$$consolidateTransformList} from "../consolidateTransformList/consolidateTransformList.index.js";
import {$$getBaseTransformList} from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initRotateTransform } from "../initRotateTransform/initRotateTransform.index.js";
import {$$mergeRotateTransform} from "../mergeRotateTransform/mergeRotateTransform.index.js";
import {$$updateRotateTransform} from "../updateRotateTransform/updateRotateTransform.index.js";

export const $$controlRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle = 0, cx = 0, cy = 0 } = {}
) => {
  const transform = $$initRotateTransform($svg)($el, { angle, cx, cy });

  const controller = {};
  controller.update = ({ angle }) => {
    $$updateRotateTransform(transform, { angle, cx: 0, cy: 0 });
    return controller;
  };
  controller.append = ({ angle }) => {
    $$appendRotateTransform(transform, { angle, cx: 0, cy: 0 });
    return controller;
  };
  controller.end = () => {
    $$mergeRotateTransform($svg)($el);
    $$consolidateTransformList($$getBaseTransformList($el));
    return $el;
  };

  return { $el, transform, controller };
};
