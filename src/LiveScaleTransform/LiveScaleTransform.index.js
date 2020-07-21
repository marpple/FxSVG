import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$mergeScaleTransform } from "../mergeScaleTransform/mergeScaleTransform.index.js";
import { $$updateScaleTransform } from "../updateScaleTransform/updateScaleTransform.index.js";

export class $$LiveScaleTransform extends $$LiveTransform {
  constructor(
    { index = 0, cx = 0, cy = 0, sx = 1, sy = 1 } = {},
    $el,
    $svg = $$getSVG()
  ) {
    super();

    this.is_done = false;

    this.transform = $$initScaleTransform({ index, cx, cy, sx, sy })($el, $svg);
    this.index = index;
    this.$el = $el;
    this.$svg = $svg;
  }

  static $$create({ index = 0, sx = 1, sy = 1, cx = 0, cy = 0 } = {}) {
    return ($el, $svg = $$getSVG()) =>
      new $$LiveScaleTransform({ index, sx, sy, cx, cy }, $el, $svg);
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

  $$merge() {
    const { index, $el, $svg } = this;
    $$mergeScaleTransform({ index: index + 1 })($el, $svg);
  }
}
