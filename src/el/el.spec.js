import { expect } from "chai";
import { each, go, mapL } from "fxjs2";
import { $$el } from "./el.index.js";

describe(`$$el`, function () {
  it(`The return value is a SVGElement representing the input SVG string.`, function () {
    go(
      [
        $$el(),
        $$el(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
      ],
      mapL((f) => f(`<circle cx="10" cy="20" r="30"></circle>`)),
      each(($el) => {
        expect($el).to.be.instanceof(SVGElement);
        expect($el.nodeName.toLowerCase()).to.equal("circle");
        expect($el.getAttributeNS(null, "cx")).to.equal("10");
        expect($el.getAttributeNS(null, "cy")).to.equal("20");
        expect($el.getAttributeNS(null, "r")).to.equal("30");
      })
    );
  });

  it(`
  The return SVGElement will be the first element from the input SVG string.
  All other elements will be ignored.
  `, function () {
    go(
      [
        $$el(),
        $$el(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
      ],
      mapL((f) =>
        f(`
          <circle cx="10" cy="20" r="30"></circle>
          <rect x="100" y="110" width="120" height="130"></rect>
        `)
      ),
      each(($el) => {
        expect($el).to.be.instanceof(SVGElement);
        expect($el.nodeName.toLowerCase()).to.equal("circle");
        expect($el.nodeName.toLowerCase()).not.to.equal("rect");
      })
    );
  });
});
