import chai from "chai";
import { flatMapL, mapL } from "fxjs/es";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$el } from "./el.index.js";

const { expect } = chai;

const MOCK_STR = `<circle cx="10" cy="20" r="30"></circle>`;

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const expectElFromMockStr = ($el) => {
  expect($el).instanceof(SVGElement);
  expect($el.nodeName.toLowerCase()).equal("circle");
  expect($$getAttrNS("cx")($el)).equal("10");
  expect($$getAttrNS("cy")($el)).equal("20");
  expect($$getAttrNS("r")($el)).equal("30");
};

export default ({ describe, it }) => [
  describe(`$$el`, function () {
    it(`The return value is a SVG element using the input SVG string.`, function () {
      for (const $svg of setupSVGList()) {
        const $el = $$el(MOCK_STR)($svg);

        expectElFromMockStr($el);
      }
    });

    it(`The return value is the first element from the input SVG string.
        All other elements will be ignored.`, function () {
      const svg_str = `${MOCK_STR}
                       <rect x="100" y="110" width="120" height="130"></rect>`;
      for (const $svg of setupSVGList()) {
        const $el = $$el(svg_str)($svg);

        expectElFromMockStr($el);
        expect($el.nodeName.toLowerCase()).not.equal("rect");
      }
    });

    it(`The return value is undefined
        when the input SVG string is empty string or there is no input SVG string.`, function () {
      const cases = flatMapL(
        ($svg) => mapL((svg_str) => ({ svg_str, $svg }), ["", undefined]),
        setupSVGList()
      );
      for (const { $svg, svg_str } of cases) {
        const $el = $$el(svg_str)($svg);

        expect($el).undefined;
      }
    });
  }),
];
