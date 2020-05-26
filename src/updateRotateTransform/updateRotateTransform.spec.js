import { expect } from "chai";
import { makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$updateRotateTransform } from "./updateRotateTransform.index.js";

describe(`$$updateRotateTransform`, function () {
  let t1;
  let t2;

  beforeEach(function () {
    t1 = $$createSVGTransformRotate()({
      angle: makeRandomInt(),
      cx: 0,
      cy: 0,
    });
    t2 = $$createSVGTransformRotate()({
      angle: makeRandomInt(),
      cx: makeRandomInt(),
      cy: makeRandomInt(),
    });
  });

  it(`The SVGTransform's angle value will be updated to the input value.`, function () {
    const angle = makeRandomInt();
    $$updateRotateTransform(t1, { angle });

    expect(t1.angle).to.equal(angle);
  });

  it(`The SVGTransform's cx, cy values will be reset to 0.`, function () {
    $$updateRotateTransform(t2, { angle: makeRandomInt() });

    expect(t2.matrix.e).to.equal(0);
    expect(t2.matrix.f).to.equal(0);
  });

  it(`If no second arguments, the function will throw an error.`, function () {
    expect(() => $$updateRotateTransform(t1)).to.throw();
  });

  it(`If no angle value, the function will throw an error.`, function () {
    expect(() => $$updateRotateTransform(t1, {})).to.throw();
  });
});
