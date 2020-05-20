import {$$appendRotateTransform} from "./appendRotateTransform.js";
import {$$consolidateTransformList} from "./consolidateTransformList.js";
import {$$getBaseTransformList} from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";
import { $$initRotateTransform } from "./initRotateTransform.js";
import {$$mergeRotateTransform} from "./mergeRotateTransform.js";
import {$$updateRotateTransform} from "./updateRotateTransform.js";

export const $$controlRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle = 0, cx = 0, cy = 0 } = {}
) => {
  const transform = $$initRotateTransform($svg)($el, { angle, cx, cy });

  const controller = {};
  controller.update = ({ angle }) => {
    $$updateRotateTransform(transform, { angle, cx, cy });
    return controller;
  };
  controller.append = ({ angle }) => {
    $$appendRotateTransform(transform, { angle, cx, cy });
    return controller;
  };
  controller.end = () => {
    $$mergeRotateTransform($svg)($el);
    $$consolidateTransformList($$getBaseTransformList($el));
    return $el;
  };

  return { $el, transform, controller };
};
