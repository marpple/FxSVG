import chai from "chai";
import { $$el } from "../el/el.index.js";
import { $$hasAttrNS } from "../hasAttrNS/hasAttrNS.index.js";
import { $$removeAttrNS } from "./removeAttrNS.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$removeAttrNS`, function () {
    it(`The function returns "undefined" whether the attribute exists or not.`, function () {
      // given
      const key = "data-foo";
      const dummy_key = "data-baz";
      const el = $$el(
        `<circle cx="10" cy="10" r="20" ${key}="bar"></circle>`
      )();

      // when
      const received_value1 = $$removeAttrNS(key)(el);
      const received_value2 = $$removeAttrNS(dummy_key)(el);

      // then
      expect(received_value1).undefined;
      expect(received_value2).undefined;
    });

    it(`The function remove the attribute from the element.`, function () {
      // given
      const key = "data-foo";
      const el = $$el(
        `<circle cx="10" cy="10" r="20" ${key}="bar"></circle>`
      )();

      // when
      $$removeAttrNS(key)(el);

      // then
      expect($$hasAttrNS(key)(el)).false;
    });
  }),
];
