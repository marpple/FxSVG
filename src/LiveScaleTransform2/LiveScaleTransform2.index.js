import { defaultTo } from "fxjs/esm";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$mergeScaleTransform2 } from "../mergeScaleTransform2/mergeScaleTransform2.index.js";
import { $$updateScaleTransform } from "../updateScaleTransform/updateScaleTransform.index.js";

export class $$LiveScaleTransform2 extends $$LiveTransform {
  constructor(
    {
      index = 0,
      cx = 0,
      cy = 0,
      sx = 1,
      sy = 1,
      is_need_correction = true,
      x_name,
      y_name,
      width_name,
      height_name,
      direction,
    } = {},
    $el,
    $svg = $$getSVG()
  ) {
    super();

    this.is_done = false;

    this.transform = $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);
    this.index = index;
    this.is_need_correction = is_need_correction;
    this.x_name = x_name;
    this.y_name = y_name;
    this.width_name = width_name;
    this.height_name = height_name;
    this.direction = direction;
    this.$el = $el;
  }

  static $$create({
    index = 0,
    cx = 0,
    cy = 0,
    sx = 1,
    sy = 1,
    is_need_correction = true,
    x_name,
    y_name,
    width_name,
    height_name,
    direction,
  } = {}) {
    return ($el, $svg = $$getSVG()) =>
      new $$LiveScaleTransform2(
        {
          index,
          cx,
          cy,
          sx,
          sy,
          is_need_correction,
          x_name,
          y_name,
          width_name,
          height_name,
          direction,
        },
        $el,
        $svg
      );
  }

  $$getIsDone() {
    return this.is_done;
  }

  $$done() {
    this.is_done = true;
  }

  $$update({ sx, sy } = {}) {
    $$updateScaleTransform({ sx, sy })(this.transform);
  }

  $$merge({
    is_need_correction: is_need_correction1,
    x_name: x_name1,
    y_name: y_name1,
    width_name: width_name1,
    height_name: height_name1,
    direction: direction1,
  } = {}) {
    const {
      $el,
      index,
      is_need_correction: is_need_correction2,
      x_name: x_name2,
      y_name: y_name2,
      width_name: width_name2,
      height_name: height_name2,
      direction: direction2,
    } = this;
    const is_need_correction = defaultTo(
      is_need_correction2,
      is_need_correction1
    );
    const x_name = defaultTo(x_name2, x_name1);
    const y_name = defaultTo(y_name2, y_name1);
    const width_name = defaultTo(width_name2, width_name1);
    const height_name = defaultTo(height_name2, height_name1);
    const direction = defaultTo(direction2, direction1);
    $$mergeScaleTransform2({
      index: index + 1,
      is_need_correction,
      x_name,
      y_name,
      width_name,
      height_name,
      direction,
    })($el);
  }
}
