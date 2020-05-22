import { $$el } from "./el.index.js";

describe(`$$el`, () => {
  test(`will return a "SVGElement" using the input SVG string`, () => {
    const str = `<circle cx="10" cy="20" r="30"></circle>`;
    const $el = $$el()(str);

    expect($el).toBeInstanceOf(SVGElement);
    expect($el.nodeName).toEqual("circle");
    expect($el.getAttributeNS(null, "cx")).toEqual("10");
    expect($el.getAttributeNS(null, "cy")).toEqual("20");
    expect($el.getAttributeNS(null, "r")).toEqual("30");
  });

  test(`
  will return the first "SVGElement" using the input SVG string
  even there are multiple SVG Elements in SVG string
  `, () => {
    const str = `
      <circle cx="10" cy="20" r="30"></circle>
      <rect x="100" y="110" width="120" height="130"></rect>
    `;
    const $el = $$el()(str);

    expect($el).toBeInstanceOf(SVGElement);
    expect($el.nodeName).toEqual("circle");
    expect($el.nodeName).not.toEqual("rect");
  });
});
