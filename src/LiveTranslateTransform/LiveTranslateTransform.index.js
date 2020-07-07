import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initTranslateTransform } from "../initTranslateTransform/initTranslateTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$updateTranslateTransform } from "../updateTranslateTransform/updateTranslateTransform.index.js";

export class $$LiveTranslateTransform {
  constructor(
    { index = 0, tx = 0, ty = 0, x_name, y_name } = {},
    $el,
    $svg = $$getSVG()
  ) {
    this.transform = $$initTranslateTransform({ tx, ty, index })($el, $svg);
    this.x_name = x_name;
    this.y_name = y_name;
    this.index = index;
    this.$svg = $svg;
  }

  static from({ index = 0, tx = 0, ty = 0, x_name, y_name } = {}) {
    return ($el, $svg = $$getSVG()) =>
      new $$LiveTranslateTransform(
        { index, tx, ty, x_name, y_name },
        $el,
        $svg
      );
  }
}

$$LiveTransform.instance($$LiveTranslateTransform, {
  $$update({ tx, ty }) {
    return (live_transform) => {
      const { transform } = live_transform;
      $$updateTranslateTransform({ tx, ty })(transform);
      return live_transform;
    };
  },
});
