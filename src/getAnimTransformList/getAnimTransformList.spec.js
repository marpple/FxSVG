import { expect } from "chai";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getAnimTransformList } from "./getAnimTransformList.index.js";

describe(`$$getAnimTransformList`, function () {
  it(`
  The return list is same with the base transform list
  if the element have no animations.
  `, function () {
    const t_attr = makeRandomTransformAttributeValue();
    const $el = $$el()(`
      <rect
        x="${makeRandomNumber()}"
        y="${makeRandomNumber()}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        ${t_attr ? `transform="${t_attr}"` : ""}
      >
      </rect>
    `);

    expect($$getAnimTransformList($el)).to.deep.equal(
      $$getBaseTransformList($el)
    );
  });
});
