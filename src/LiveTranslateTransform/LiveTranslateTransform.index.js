import { defaultTo } from "fxjs/es";
import { $$appendTranslateTransform } from "../appendTranslateTransform/appendTranslateTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initTranslateTransform } from "../initTranslateTransform/initTranslateTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$mergeTranslateTransform } from "../mergeTranslateTransform/mergeTranslateTransform.index.js";
import { $$updateTranslateTransform } from "../updateTranslateTransform/updateTranslateTransform.index.js";

export class $$LiveTranslateTransform extends $$LiveTransform {
  constructor(
    { index = 0, tx = 0, ty = 0, x_name, y_name } = {},
    $el,
    $svg = $$getSVG()
  ) {
    super();

    this.is_done = false;

    this.transform = $$initTranslateTransform({ tx, ty, index })($el, $svg);
    this.x_name = x_name;
    this.y_name = y_name;
    this.index = index;
    this.$el = $el;
    this.$svg = $svg;
  }

  static $$create({ index = 0, tx = 0, ty = 0, x_name, y_name } = {}) {
    return ($el, $svg = $$getSVG()) =>
      new $$LiveTranslateTransform(
        { index, tx, ty, x_name, y_name },
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

  $$update({ tx, ty } = {}) {
    $$updateTranslateTransform({ tx, ty })(this.transform);
  }

  $$append({ tx = 0, ty = 0 } = {}) {
    $$appendTranslateTransform({ tx, ty })(this.transform);
  }

  $$merge({ x_name: x_name1, y_name: y_name1 } = {}) {
    const { x_name: x_name2, y_name: y_name2, index, $el, $svg } = this;
    const x_name = defaultTo(x_name2, x_name1);
    const y_name = defaultTo(y_name2, y_name1);
    if (x_name && y_name) {
      $$mergeTranslateTransform({ index, x_name, y_name })($el, $svg);
    }
  }
}
