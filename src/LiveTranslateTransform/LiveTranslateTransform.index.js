import { defaultTo } from "fxjs2";
import { $$appendTranslateTransform } from "../appendTranslateTransform/appendTranslateTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$initTranslateTransform } from "../initTranslateTransform/initTranslateTransform.index.js";
import { $$LiveTransform } from "../LiveTransform/LiveTransform.index.js";
import { $$mergeTranslateTransform } from "../mergeTranslateTransform/mergeTranslateTransform.index.js";
import { $$updateTranslateTransform } from "../updateTranslateTransform/updateTranslateTransform.index.js";

export class $$LiveTranslateTransform {
  static get name() {
    return "$$LiveTranslateTransform";
  }

  constructor(
    { index = 0, tx = 0, ty = 0, x_name, y_name } = {},
    $el,
    $svg = $$getSVG()
  ) {
    const kvs = [
      ["transform", $$initTranslateTransform({ tx, ty, index })($el, $svg)],
      ["x_name", x_name],
      ["y_name", y_name],
      ["index", index],
      ["$el", $el],
      ["$svg", $svg],
    ];
    for (const [key, value] of kvs) {
      Object.defineProperty(this, key, {
        value,
        enumerable: false,
        configurable: false,
        writable: false,
      });
    }
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
  $$update({ tx, ty } = {}) {
    return (live_transform) => {
      const { transform } = live_transform;
      $$updateTranslateTransform({ tx, ty })(transform);
      return live_transform;
    };
  },
  $$append({ tx = 0, ty = 0 } = {}) {
    return (live_transform) => {
      const { transform } = live_transform;
      $$appendTranslateTransform({ tx, ty })(transform);
      return live_transform;
    };
  },
  $$merge({ x_name: x_name1, y_name: y_name1 }) {
    return (live_transform) => {
      const {
        x_name: x_name2,
        y_name: y_name2,
        index,
        $el,
        $svg,
      } = live_transform;
      const x_name = defaultTo(x_name2, x_name1);
      const y_name = defaultTo(y_name2, y_name1);
      if (x_name && y_name) {
        $$mergeTranslateTransform({ index, x_name, y_name })($el, $svg);
      }
      return $el;
    };
  },
});
