import { $$appendRotateTransform } from "../appendRotateTransform/appendRotateTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initRotateTransform } from "../initRotateTransform/initRotateTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$mergeRotateTransform } from "../mergeRotateTransform/mergeRotateTransform.index.js";
import { $$updateRotateTransform } from "../updateRotateTransform/updateRotateTransform.index.js";

export class $$LiveRotateTransform extends $$LiveTransform {
  constructor(
    { index = 0, cx = 0, cy = 0, angle = 0 } = {},
    $el,
    $svg = $$getSVG()
  ) {
    super();

    this.is_done = false;

    this.transform = $$initRotateTransform({ angle, index, cx, cy })($el, $svg);
    this.index = index;
    this.$el = $el;
    this.$svg = $svg;
  }

  static $$create({ index = 0, cx = 0, cy = 0, angle = 0 } = {}) {
    return ($el, $svg = $$getSVG()) =>
      new $$LiveRotateTransform({ index, cx, cy, angle }, $el, $svg);
  }

  $$getIsDone() {
    return this.is_done;
  }

  $$done() {
    this.is_done = true;
  }

  $$update({ angle } = {}) {
    $$updateRotateTransform({ angle, cx: 0, cy: 0 })(this.transform);
  }

  $$append({ angle = 0 } = {}) {
    $$appendRotateTransform({ angle })(this.transform);
  }

  $$merge() {
    $$mergeRotateTransform({ index: this.index + 1 })(this.$el, this.$svg);
  }
}
