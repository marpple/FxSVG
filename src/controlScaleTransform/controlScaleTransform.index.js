import { $$consolidateTransformList } from "../consolidateTransformList/consolidateTransformList.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$mergeScaleTransform } from "../mergeScaleTransform/mergeScaleTransform.index.js";
import { $$mergeScaleTransform2 } from "../mergeScaleTransform2/mergeScaleTransform2.index.js";
import { $$updateScaleTransform } from "../updateScaleTransform/updateScaleTransform.index.js";

export const $$controlScaleTransform = ($svg = $$getSVG()) => (
  $el,
  {
    cx,
    cy,
    sx,
    sy,
    index = 0,
    merge_type: _merge_type = 1,
    x_name: _x_name,
    y_name: _y_name,
    width_name: _width_name,
    height_name: _height_name,
    direction: _direction,
  } = {}
) => {
  const transform = $$initScaleTransform($svg)($el, {
    cx,
    cy,
    sx,
    sy,
    index,
  });

  const controller = {};
  controller.update = ({ sx, sy } = {}) => {
    $$updateScaleTransform(transform, { sx, sy });
    return controller;
  };
  controller.end = ({
    merge_type = _merge_type,
    x_name = _x_name,
    y_name = _y_name,
    width_name = _width_name,
    height_name = _height_name,
    direction = _direction,
  } = {}) => {
    merge_type === 2
      ? $$mergeScaleTransform2($el, {
          index: index + 1,
          x_name,
          y_name,
          width_name,
          height_name,
          direction,
        })
      : $$mergeScaleTransform($svg)($el, { index: index + 1 });
    $$consolidateTransformList($$getBaseTransformList($el));
    return $el;
  };

  return { $el, transform, controller };
};
