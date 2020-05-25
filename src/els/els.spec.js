import { expect } from "chai";
import { $$els } from "./els.index.js";

describe(`$$els`, () => {
  it(`will return a list of "SVGElement"s using the input SVG string`, () => {
    const list = $$els()(`
      <rect x="0" y="0" width="10" height="10"></rect>
      <circle cx="10" cy="10" r="30"></circle> 
    `);

    expect(list).to.have.lengthOf(2);

    expect(list[0]).to.be.instanceof(SVGElement);
    expect(list[0].nodeName.toLowerCase()).to.equal("rect");
    expect(list[0].getAttributeNS(null, "x")).to.equal("0");
    expect(list[0].getAttributeNS(null, "y")).to.equal("0");
    expect(list[0].getAttributeNS(null, "width")).to.equal("10");
    expect(list[0].getAttributeNS(null, "height")).to.equal("10");

    expect(list[1]).to.be.instanceof(SVGElement);
    expect(list[1].nodeName.toLowerCase()).to.equal("circle");
    expect(list[1].getAttributeNS(null, "cx")).to.equal("10");
    expect(list[1].getAttributeNS(null, "cy")).to.equal("10");
    expect(list[1].getAttributeNS(null, "r")).to.equal("30");
  });
});
