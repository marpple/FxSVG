import { curry } from "fxjs2";
import { $$appendRotateTransform } from "../appendRotateTransform/appendRotateTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initRotateTransform } from "../initRotateTransform/initRotateTransform.index.js";
import { $$mergeRotateTransform } from "../mergeRotateTransform/mergeRotateTransform.index.js";
import { $$updateRotateTransform } from "../updateRotateTransform/updateRotateTransform.index.js";

export const $$controlRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle, cx, cy, index = 0 } = {}
) => {
  const transform = $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

  const controller = {};
  controller.update = ({ angle } = {}) => {
    $$updateRotateTransform({ angle, cx: 0, cy: 0 })(transform);
    return controller;
  };
  controller.append = ({ angle } = {}) => {
    $$appendRotateTransform({ angle })(transform);
    return controller;
  };
  controller.end = () => {
    $$mergeRotateTransform($svg)($el, { index: index + 1 });
    return $el;
  };

  return { $el, transform, controller };
};

export const $$controlRotateTransform2 = ({
  angle,
  cx,
  cy,
  index = 0,
} = {}) => ($el, $svg = $$getSVG()) => {
  const transform = $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

  const controller = {};
  controller.update = ({ angle } = {}) => {
    $$updateRotateTransform({ angle, cx: 0, cy: 0 })(transform);
    return controller;
  };
  controller.append = ({ angle } = {}) => {
    $$appendRotateTransform({ angle })(transform);
    return controller;
  };
  controller.end = () => {
    $$mergeRotateTransform($svg)($el, { index: index + 1 });
    return $el;
  };

  return { $el, transform, controller };
};

export const $$controlRotateTransform3 = curry(
  ({ angle, cx, cy, index = 0 } = {}, $el, $svg = $$getSVG()) => {
    const transform = $$initRotateTransform({
      angle,
      cx,
      cy,
      index,
    })($el, $svg);

    const controller = {};
    controller.update = ({ angle } = {}) => {
      $$updateRotateTransform({ angle, cx: 0, cy: 0 })(transform);
      return controller;
    };
    controller.append = ({ angle } = {}) => {
      $$appendRotateTransform({ angle })(transform);
      return controller;
    };
    controller.end = () => {
      $$mergeRotateTransform($svg)($el, { index: index + 1 });
      return $el;
    };

    return { $el, transform, controller };
  }
);
