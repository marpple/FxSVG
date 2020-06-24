import { expect } from "chai";
import { each, flatMapL, go, mapL } from "fxjs2";
import { $$el } from "./el.index.js";

const MOCK_STR = `<circle cx="10" cy="20" r="30"></circle>`;

const expectElFromMockStr = ($el) => {
  expect($el).to.be.instanceof(SVGElement);
  expect($el.nodeName.toLowerCase()).to.equal("circle");
  expect($el.getAttributeNS(null, "cx")).to.equal("10");
  expect($el.getAttributeNS(null, "cy")).to.equal("20");
  expect($el.getAttributeNS(null, "r")).to.equal("30");
};

export default ({ describe, it }) => [
  describe(`$$el`, function () {
    it(`The return value is a SVG element using the input SVG string.`, function () {
      go(
        [
          $$el(),
          $$el(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        ],
        mapL((f) => f(MOCK_STR)),
        each(expectElFromMockStr)
      );
    });

    it(`The return value is the first element from the input SVG string.
        All other elements will be ignored.`, function () {
      go(
        [
          $$el(),
          $$el(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        ],
        mapL((f) =>
          f(`${MOCK_STR}
             <rect x="100" y="110" width="120" height="130"></rect>`)
        ),
        each(($el) => {
          expectElFromMockStr($el);
          expect($el.nodeName.toLowerCase()).not.to.equal("rect");
        })
      );
    });

    it(`The return value is undefined
        when the input SVG string is empty string or there is no input SVG string.`, function () {
      go(
        [
          $$el(),
          $$el(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        ],
        flatMapL((f) => mapL((input) => f(input), ["", undefined])),
        each($el => expect($el).to.undefined)
      );
    });
  }),
];
