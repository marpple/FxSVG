import { expect } from "chai";
import {
  deepCopyTransformListToMatrixList,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$controlRotateTransform } from "./controlRotateTransform.index.js";

describe(`$$controlRotateTransform`, function () {
  let angle;
  let cx;
  let cy;
  let $el;
  let result;

  beforeEach(function () {
    angle = makeRandomInt(0, 360);
    cx = makeRandomInt();
    cy = makeRandomInt();
    const t_attr = makeRandomTransformAttributeValue();
    $el = $$el()(`
      <rect
        x="${makeRandomNumber()}"
        y="${makeRandomNumber()}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        ${t_attr ? `transform="${t_attr}"` : ""}
      >
      </rect> 
    `);
    result = $$controlRotateTransform()($el, { angle, cx, cy });
  });

  it(`The return object has $el, controller, transform properties.`, function () {
    expect(result).to.have.property("$el");
    expect(result).to.have.property("controller");
    expect(result).to.have.property("transform");
  });

  it(`The return $el is same with the input $el.`, function () {
    const { $el: $result_el } = result;

    expect($result_el).to.equal($el);
  });

  it(`The return controller object has update, append, end methods.`, function () {
    const { controller } = result;

    expect(controller).to.have.property("update");
    expect(controller.update).is.a("function");
    expect(controller).to.have.property("append");
    expect(controller.append).is.a("function");
    expect(controller).to.have.property("end");
    expect(controller.end).is.a("function");
  });

  it(`
  The return transform object is a rotate transform
  whose angle is the input angle.
  `, function () {
    const { transform } = result;

    expect($$isRotateSVGTransform(transform)).to.be.true;
    expect(transform.angle).to.equal(angle);
  });

  it(`
  The return transform object is the SVGTransform at 1 index in SVGTransformList of $el.
  `, function () {
    const { $el, transform } = result;
    const l = $$getBaseTransformList($el);

    expect(l.getItem(1)).to.deep.equal(transform);
  });

  it(`
  The controller.update method update the return transform with the input angle.
  `, function () {
    const { $el, transform, controller } = result;

    const new_angle = makeRandomInt(0, 360);

    controller.update({ angle: new_angle });

    expect(transform.angle).to.equal(new_angle);
    expect(transform).to.deep.equal($$getBaseTransformList($el).getItem(1));
  });

  it(`
  The controller.append method add the input angle to the return transform. 
  `, function () {
    const { $el, transform, controller } = result;

    const angle_to_add = makeRandomInt(0, 360);

    controller.append({ angle: angle_to_add });

    expect(transform.angle).to.equal(angle + angle_to_add);
    expect(transform).to.deep.equal($$getBaseTransformList($el).getItem(1));
  });

  it(`
  The controller.end method merge the all transforms of the element.
  `, function () {
    const { $el, controller } = result;
    const before_l = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );

    controller.end();

    const after_l = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    );

    expect(after_l.length).to.equal(1);
    expect(after_l[0]).to.deep.equal(
      before_l.reduce((m1, m2) => m1.multiply(m2))
    );
  });

  it(`Arbitrary use case test.`, function () {
    const { controller, $el } = result;
    const list = [...Array(makeRandomInt())]
      .map(() => makeRandomBool())
      .map((a) => (a ? "append" : "update"))
      .map((operation) => ({
        operation,
        angle: makeRandomInt(0, 360),
      }));
    const { angle: angle2 } = list.reduce(
      ({ angle: angle1 }, { operation, angle: angle2 }) =>
        operation === "update" ? { angle: angle2 } : { angle: angle1 + angle2 },
      {
        angle,
      }
    );
    list.forEach(({ operation, angle }) => controller[operation]({ angle }));
    const compressed_m = deepCopyTransformListToMatrixList(
      $$getBaseTransformList($el)
    )
      .slice(3)
      .reduce(
        (m1, m2) => m1.multiply(m2),
        $$createSVGTransformRotate()({ angle: angle2, cx, cy }).matrix
      );

    controller.end();

    expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
    expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
      compressed_m
    );
  });
});
