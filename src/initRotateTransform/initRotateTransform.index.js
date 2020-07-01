import { curry } from "fxjs2";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle = 0, cx = 0, cy = 0, index = 0 } = {}
) => {
  const transform_list = $$getBaseTransformList($el);

  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: -cx, ty: -cy })($svg),
    index
  );
  const transform = transform_list.insertItemBefore(
    $$createSVGTransformRotate({ angle })($svg),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
    index
  );

  return transform;
};

export const $$initRotateTransform2 = ({
  angle = 0,
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
    $$createSVGTransformRotate({ angle })($svg),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
    index
  );

  return transform;
};

export const $$initRotateTransform3 = curry(
  ({ angle = 0, cx = 0, cy = 0, index = 0 } = {}, $el, $svg = $$getSVG()) => {
    const transform_list = $$getBaseTransformList($el);

    transform_list.insertItemBefore(
      $$createSVGTransformTranslate({ tx: -cx, ty: -cy })($svg),
      index
    );
    const transform = transform_list.insertItemBefore(
      $$createSVGTransformRotate({ angle })($svg),
      index
    );
    transform_list.insertItemBefore(
      $$createSVGTransformTranslate({ tx: cx, ty: cy })($svg),
      index
    );

    return transform;
  }
);
