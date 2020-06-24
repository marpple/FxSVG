import { $$appendTranslateTransform } from "../appendTranslateTransform/appendTranslateTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initTranslateTransform } from "../initTranslateTransform/initTranslateTransform.index.js";
import { $$mergeTranslateTransform } from "../mergeTranslateTransform/mergeTranslateTransform.index.js";
import { $$updateTranslateTransform } from "../updateTranslateTransform/updateTranslateTransform.index.js";

export const $$controlTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { index = 0, tx, ty, x_name, y_name } = {}
) => {
  const transform = $$initTranslateTransform($svg)($el, { tx, ty, index });

  const controller = {};
  controller.update = ({ tx, ty } = {}) => {
    $$updateTranslateTransform(transform, { tx, ty });
    return controller;
  };
  controller.append = ({ tx, ty } = {}) => {
    $$appendTranslateTransform(transform, { tx, ty });
    return controller;
  };
  controller.end = () => {
    if (x_name && y_name) {
      $$mergeTranslateTransform($svg)($el, { index, x_name, y_name });
    }
    return $el;
  };

  return { $el, controller, transform };
};
