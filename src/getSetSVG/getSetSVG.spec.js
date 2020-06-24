import { expect } from "chai";
import { each, go, go1, head, mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$getSVG, $$setSVG } from "./getSetSVG.index.js";

export default ({ describe, it, beforeEach }) => [
  describe(`$$setSVG + $$getSVG`, function () {
    it(`"$$setSVG" set the SVG element that "$$getSVG" returns.`, function () {
      const $svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      $$setSVG($svg);

      expect($$getSVG()).to.equal($svg);
    });
  }),
  describe(`$$setSVG`, function () {
    it(`The return value is the same reference with the input value.`, function () {
      const $svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      expect($$setSVG($svg)).to.equal($svg);
    });
  }),
  describe(`$$getSVG`, function () {
    beforeEach(function () {
      $$setSVG(undefined);
    });

    it(`The return value is a SVG element.`, function () {
      const $svg = $$getSVG();

      expect($svg.nodeName.toLowerCase()).to.equal("svg");
    });

    it(`The return value is always same.`, function () {
      go(
        makeRandomInt(2),
        rangeL,
        mapL(() => $$getSVG()),
        (iter) =>
          go1(head(iter), ($a) => each(($b) => expect($b).to.equal($a), iter))
      );
    });
  }),
];
