import { $$appendTranslateTransform } from "./appendTranslateTransform.js";
import { $$consolidateTransformList } from "./consolidateTransformList.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";
import { $$initTranslateTransform } from "./initTranslateTransform.js";
import { $$mergeTranslateTransform } from "./mergeTranslateTransform.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform.js";

export const $$controlTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { tx = 0, ty = 0, x_name, y_name } = {}
) => {
  const transform = $$initTranslateTransform($svg)($el, { tx, ty });

  const controller = {};
  controller.update = ({ tx, ty }) => {
    $$updateTranslateTransform(transform, { tx, ty });
    return controller;
  };
  controller.append = ({ tx, ty }) => {
    $$appendTranslateTransform(transform, { tx, ty });
    return controller;
  };
  controller.end = () => {
    if (x_name && y_name) {
      $$mergeTranslateTransform($svg)($el, { x_name, y_name });
    }
    $$consolidateTransformList($$getBaseTransformList($el));
    return $el;
  };

  return { $el, controller, transform };
};
