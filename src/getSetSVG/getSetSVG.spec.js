import chai from "chai";
import { map, rangeL } from "fxjs/es";
import { $$getSVG, $$setSVG } from "./getSetSVG.index.js";

export default ({ describe, it, beforeEach }) => [
  describe(`$$setSVG + $$getSVG`, function () {
    it(`$$getSVG returns the SVGSVGElement set by $$setSVG.`, function () {
      // given
      const svg_el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      $$setSVG(svg_el);

      // when
      const received = $$getSVG();

      // then
      chai.expect(received).equal(svg_el);
    });
  }),
  describe(`$$setSVG`, function () {
    it(`$$setSVG returns the same reference with the input SVGSVGElement.`, function () {
      // given
      const svg_el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      // when
      const received = $$setSVG(svg_el);

      // then
      chai.expect(received).equal(svg_el);
    });
  }),
  describe(`$$getSVG`, function () {
    beforeEach(function () {
      $$setSVG(null);
    });

    it(`$$getSVG returns a SVGSVGElement.`, function () {
      // given
      // document.createElementNS should be available.

      // when
      const svg_el = $$getSVG();

      // then
      chai.expect(svg_el.nodeName.toLowerCase()).equal("svg");
      chai.expect(svg_el).instanceof(SVGSVGElement);
    });

    it(`$$getSVG always returns the same reference.`, function () {
      // given
      // document.createElementNS should be available.

      // when
      const received_list = map($$getSVG, rangeL(10));

      // then
      const [first] = received_list;
      for (const a of received_list) {
        chai.expect(a).equal(first);
      }
    });
  }),
];
