import { expect } from "chai";
import { $$el } from "./el.index.js";

describe(`$$el`, () => {
  it(`will return a "SVGElement" using the input SVG string`, () => {
    const str = `<circle cx="10" cy="20" r="30"></circle>`;
    const $el = $$el()(str);

    expect($el).to.be.instanceof(SVGElement);
    expect($el.nodeName.toLowerCase()).to.equal("circle");
    expect($el.getAttributeNS(null, "cx")).to.equal("10");
    expect($el.getAttributeNS(null, "cy")).to.equal("20");
    expect($el.getAttributeNS(null, "r")).to.equal("30");
  });

  it(`
  will return the first "SVGElement" using the input SVG string
  even there are multiple SVG Elements in SVG string
  `, () => {
    const str = `
      <circle cx="10" cy="20" r="30"></circle>
      <rect x="100" y="110" width="120" height="130"></rect>
    `;
    const $el = $$el()(str);

    expect($el).to.be.instanceof(SVGElement);
    expect($el.nodeName.toLowerCase()).to.equal("circle");
    expect($el.nodeName.toLowerCase()).not.to.equal("rect");
  });
});
