import { expect } from "chai";
import { makeRandomNumber } from "../../test/utils/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$consolidateTransformList } from "./consolidateTransformList.index.js";

describe(`$$consolidateTransformList`, function () {
  let transform_list;

  beforeEach(function () {
    const $el = $$el()(`
      <circle
        cx="10"
        cy="20"
        r="30"
        transform="${[
          `translate(${makeRandomNumber()}, ${makeRandomNumber()})`,
          `rotate(${makeRandomNumber()} ${makeRandomNumber()} ${makeRandomNumber()})`,
          `scale(${makeRandomNumber()} ${makeRandomNumber()})`,
          `matrix(${[...Array(6)].map(() => makeRandomNumber()).join(" ")})`,
        ].join(" ")}"
      >
      </circle>
    `);
    transform_list = $$getBaseTransformList($el);
  });

  it(`The function will return the same reference SVGTransformList with the input SVGTransformList`, function () {
    expect($$consolidateTransformList(transform_list)).to.equal(transform_list);
  });

  it(`The consolidated SVGTransformList has only one SVGTransform.`, function () {
    $$consolidateTransformList(transform_list);

    expect(transform_list.numberOfItems).to.equal(1);
  });

  it(`The consolidated SVGTransform's matrix is same with the result that multiply all SVGTransform's matrix.`, function () {
    const m = [...transform_list]
      .map(({ matrix: m }) => m)
      .reduce((m1, m2) => m1.multiply(m2));

    $$consolidateTransformList(transform_list);

    expect(transform_list.getItem(0).matrix).to.deep.equal(m);
  });
});
