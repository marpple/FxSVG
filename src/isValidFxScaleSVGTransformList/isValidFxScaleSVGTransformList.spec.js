import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "./isValidFxScaleSVGTransformList.index.js";

describe(`$$isValidFxScaleSVGTransformList`, function () {
  let transform_list;
  let valid_index;

  beforeEach(function () {
    const transform_attr = makeRandomTransformAttributeValue(10);
    const $el = $$el()(
      `<rect x="0" y="0" width="10" height="10" transform="${transform_attr}"></rect>`
    );
    transform_list = $$getBaseTransformList($el);
    valid_index = makeRandomInt(1, transform_list.numberOfItems - 1);
  });

  it(`If the input index [<=] 0, the function will return false.`, function () {
    const index = -makeRandomInt();

    const result = $$isValidFxScaleSVGTransformList(transform_list, { index });
    expect(result).to.be.false;
  });

  it(`If the input index is [>=] SVGTransformList.numberOfItems - 1, the function will return false.`, function () {
    const index = makeRandomInt(
      transform_list.numberOfItems - 1,
      transform_list.numberOfItems + 1000
    );

    const result = $$isValidFxScaleSVGTransformList(transform_list, { index });
    expect(result).to.be.false;
  });

  describe(`The SVGTransform at index - 1 should be a translate SVGTransform.`, function () {
    it(`If the SVGTransform at index - 1 is a matrix SVGTransform, the function will return false.`, function () {
      const matrix = makeRandomSVGMatrix();
      const matrix_t = $$createSVGTransformMatrix()({ matrix });
      transform_list.insertItemBefore(matrix_t, valid_index - 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index - 1,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index - 1 is a rotate SVGTransform, the function will return false.`, function () {
      const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
      const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
      transform_list.insertItemBefore(rotate_t, valid_index - 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index - 1,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index - 1 is a scale SVGTransform, the function will return false.`, function () {
      const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
      const scale_t = $$createSVGTransformScale()({ sx, sy });
      transform_list.insertItemBefore(scale_t, valid_index - 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index - 1,
      });
      expect(result).to.be.false;
    });
  });

  describe(`The SVGTransform at index should be a scale SVGTransform.`, function () {
    it(`If the SVGTransform at index is a matrix SVGTransform, the function will return false.`, function () {
      const matrix = makeRandomSVGMatrix();
      const matrix_t = $$createSVGTransformMatrix()({ matrix });
      transform_list.insertItemBefore(matrix_t, valid_index);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index is a rotate SVGTransform, the function will return false.`, function () {
      const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
      const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
      transform_list.insertItemBefore(rotate_t, valid_index);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index is a translate SVGTransform, the function will return false.`, function () {
      const [tx, ty] = mapL(() => makeRandomNumber(), rangeL(2));
      const translate_t = $$createSVGTransformTranslate()({ tx, ty });
      transform_list.insertItemBefore(translate_t, valid_index);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index,
      });
      expect(result).to.be.false;
    });
  });

  describe(`The SVGTransform at index + 1 should be a translate SVGTransform.`, function () {
    it(`If the SVGTransform at index + 1 is a matrix SVGTransform, the function will return false.`, function () {
      const matrix = makeRandomSVGMatrix();
      const matrix_t = $$createSVGTransformMatrix()({ matrix });
      transform_list.insertItemBefore(matrix_t, valid_index + 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index + 1,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index + 1 is a rotate SVGTransform, the function will return false.`, function () {
      const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
      const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
      transform_list.insertItemBefore(rotate_t, valid_index + 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index + 1,
      });
      expect(result).to.be.false;
    });

    it(`If the SVGTransform at index + 1 is a scale SVGTransform, the function will return false.`, function () {
      const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
      const scale_t = $$createSVGTransformScale()({ sx, sy });
      transform_list.insertItemBefore(scale_t, valid_index + 1);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index: valid_index + 1,
      });
      expect(result).to.be.false;
    });
  });

  // TODO
  describe(`[TODO]`, function () {});
});
