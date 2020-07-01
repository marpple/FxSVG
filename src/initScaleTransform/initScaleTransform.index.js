import { curry } from "fxjs2";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initScaleTransform = ($svg = $$getSVG()) => (
  $el,
  { sx = 1, sy = 1, cx = 0, cy = 0, index = 0 } = {}
) => {
  const transform_list = $$getBaseTransformList($el);

  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: -cx, ty: -cy })($svg),
    index
  );
  const transform = transform_list.insertItemBefore(
    $$createSVGTransformScale({ sx, sy })($svg),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
    index
  );

  return transform;
};

export const $$initScaleTransform2 = ({
  sx = 1,
  sy = 1,
  cx = 0,
  cy = 0,
  index = 0,
} = {}) => ($el, $svg = $$getSVG()) => {
  const transform_list = $$getBaseTransformList($el);

  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: -cx, ty: -cy })($svg),
    index
  );
  const transform = transform_list.insertItemBefore(
    $$createSVGTransformScale({ sx, sy })($svg),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
    index
  );

  return transform;
};

export const $$initScaleTransform3 = curry(
  (
    { sx = 1, sy = 1, cx = 0, cy = 0, index = 0 } = {},
    $el,
    $svg = $$getSVG()
  ) => {
    const transform_list = $$getBaseTransformList($el);

    transform_list.insertItemBefore(
      $$createSVGTransformTranslate({ tx: -cx, ty: -cy })($svg),
      index
    );
    const transform = transform_list.insertItemBefore(
      $$createSVGTransformScale({ sx, sy })($svg),
      index
    );
    transform_list.insertItemBefore(
      $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
      index
    );

    return transform;
  }
);
