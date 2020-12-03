import chai from "chai";
import { all, go, head, join, mapL } from "fxjs/esm";
import { $$el } from "../el/el.index.js";
import { $$hasAttrNS } from "./hasAttrNS.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$hasAttrNS`, function () {
    it(`The function returns "true" if the element has the attribute.`, function () {
      // given
      const attrs = [
        ["cx", 10],
        ["cy", 10],
        ["r", 20],
        ["data-hello", "world"],
      ];
      const el = go(
        attrs,
        mapL(([k, v]) => `${k}="${v}"`),
        join(" "),
        (attrs) => $$el(`<circle ${attrs}></circlec>`)()
      );

      // when
      const received = go(
        attrs,
        mapL(head),
        mapL((attr_name) => $$hasAttrNS(attr_name)(el)),
        all
      );

      // then
      expect(received).true;
    });

    it(`The function returns "false" if the element has no attribute with the name.`, function () {
      // given
      const attr_name = "data-test";
      const el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();

      // when
      const receive = $$hasAttrNS(attr_name)(el);

      // then
      expect(receive).false;
    });
  }),
];
