import chai from "chai";
import { head, mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$getSVG, $$setSVG } from "./getSetSVG.index.js";

const { expect } = chai;

export default ({ describe, it, beforeEach }) => [
  describe(`$$setSVG + $$getSVG`, function () {
    it(`"$$setSVG" set the SVG element that "$$getSVG" returns.`, function () {
      const $svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      $$setSVG($svg);

      expect($$getSVG()).equal($svg);
    });
  }),
  describe(`$$setSVG`, function () {
    it(`The return value is the same reference with the input value.`, function () {
      const $svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      expect($$setSVG($svg)).equal($svg);
    });
  }),
  describe(`$$getSVG`, function () {
    beforeEach(function () {
      $$setSVG(undefined);
    });

    it(`The return value is a SVG element.`, function () {
      const $svg = $$getSVG();

      expect($svg.nodeName.toLowerCase()).equal("svg");
    });

    it(`The return value is always same.`, function () {
      const iter = mapL(() => $$getSVG(), rangeL(makeRandomInt(2)));

      const $a = head(iter);
      for (const $b of iter) {
        expect($b).equal($a);
      }
    });
  }),
];
