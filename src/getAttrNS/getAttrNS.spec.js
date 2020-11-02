import chai from "chai";
import { $$el } from "../el/el.index.js";
import { $$getAttrNS } from "./getAttrNS.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$getAttrNS`, function () {
    it(`The function return the attribute value of the element.`, function () {
      // given
      const key = "data-foo";
      const value = "bar";
      const el = $$el(
        `<circle cx="10" cy="10" r="20" ${key}="${value}"></circle>`
      )();

      // when
      const received_value = $$getAttrNS(key)(el);

      // then
      expect(received_value).equal(value);
    });

    it(`The function return "null" for the non-existing attribute.`, function () {
      // given
      const el = $$el(`<circle cx="10" cy="10" r="20"></circle>`)();

      // when
      const received_value = $$getAttrNS("data-foo")(el);

      // then
      expect(received_value).null;
    });
  }),
];
