import { expect } from "chai";
import { $$el } from "../el/el.index.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$setAttrNS } from "./setAttrNS.index.js";

export default ({ describe, it }) => [
  describe(`$$setAttrNS`, function () {
    it(`The function returns "undefined".`, function () {
      // given
      const key = "data-foo";
      const value = "bar";
      const el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();

      // when
      const received_value = $$setAttrNS([key, value])(el);

      // then
      expect(received_value).undefined;
    });

    it(`The function makes the attribute with the value to the element.`, function () {
      // given
      const key = "data-foo";
      const value = "bar";
      const el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();

      // when
      $$setAttrNS([key, value])(el);

      // then
      expect($$getAttrNS(key)(el)).equal(value);
    });
  }),
];
