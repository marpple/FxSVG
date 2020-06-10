import { defaultTo, go, mapL } from "fxjs2";
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
    cx = 0,
    cy = 0,
    sx = 1,
    sy = 1,
    index = 0,
    merge_type: _merge_type = 1,
    x_name: _x_name,
    y_name: _y_name,
    width_name: _width_name,
    height_name: _height_name,
    direction: _direction,
  }
) => {
  const transform = $$initScaleTransform($svg)($el, {
    cx,
    cy,
    sx,
    sy,
    index,
  });

  const controller = {};
  controller.update = ({ sx, sy }) => {
    $$updateScaleTransform(transform, { sx, sy });
    return controller;
  };
  controller.end = ({
    merge_type,
    x_name,
    y_name,
    width_name,
    height_name,
    direction,
  }) => {
    defaultTo(_merge_type, merge_type) === 2
      ? go(
          [
            [_x_name, x_name],
            [_y_name, y_name],
            [_width_name, width_name],
            [_height_name, height_name],
            [_direction, direction],
          ],
          mapL((a, b) => defaultTo(a, b)),
          ([x_name, y_name, width_name, height_name, direction]) => ({
            index: index + 1,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }),
          (config) => $$mergeScaleTransform2($el, config)
        )
      : $$mergeScaleTransform($svg)($el, { index: index + 1 });
    $$consolidateTransformList($$getBaseTransformList($el));
    return $el;
  };

  return { $el, transform, controller };
};
