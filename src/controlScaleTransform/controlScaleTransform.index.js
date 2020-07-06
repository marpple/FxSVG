import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$mergeScaleTransform } from "../mergeScaleTransform/mergeScaleTransform.index.js";
import { $$mergeScaleTransform2 } from "../mergeScaleTransform2/mergeScaleTransform2.index.js";
import { $$updateScaleTransform } from "../updateScaleTransform/updateScaleTransform.index.js";

export const $$controlScaleTransform = ({
  cx,
  cy,
  sx,
  sy,
  index = 0,
  is_need_correction: _is_need_correction = true,
  merge_type: _merge_type = 1,
  x_name: _x_name,
  y_name: _y_name,
  width_name: _width_name,
  height_name: _height_name,
  direction: _direction,
} = {}) => ($el, $svg = $$getSVG()) => {
  const transform = $$initScaleTransform({
    cx,
    cy,
    sx,
    sy,
    index,
  })($el, $svg);

  const controller = {};
  controller.update = ({ sx, sy } = {}) => {
    $$updateScaleTransform({ sx, sy })(transform);
    return controller;
  };
  controller.end = ({
    is_need_correction = _is_need_correction,
    merge_type = _merge_type,
    x_name = _x_name,
    y_name = _y_name,
    width_name = _width_name,
    height_name = _height_name,
    direction = _direction,
  } = {}) => {
    merge_type === 2
      ? $$mergeScaleTransform2({
          index: index + 1,
          is_need_correction,
          x_name,
          y_name,
          width_name,
          height_name,
          direction,
        })($el)
      : $$mergeScaleTransform({ index: index + 1 })($el, $svg);
    return $el;
  };

  return controller;
};
