import { createSVGWindow } from "svgdom";
import { $$els } from "./els.index.js";

describe(`$$els`, () => {
  let $dummy_svg;

  beforeEach(() => {
    $dummy_svg = createSVGWindow().document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  });

  test(`will return a list of "SVGElement"s using the input SVG string`, () => {
    const list = $$els($dummy_svg)(`
      <rect x="0" y="0" width="10" height="10"></rect>
      <circle cx="10" cy="10" r="30"></circle> 
    `);

    expect(list.length).toBe(2);

    expect(list[0].nodeName.toLowerCase()).toEqual("rect");
    expect(list[0].getAttributeNS(null, "x")).toEqual("0");
    expect(list[0].getAttributeNS(null, "y")).toEqual("0");
    expect(list[0].getAttributeNS(null, "width")).toEqual("10");
    expect(list[0].getAttributeNS(null, "height")).toEqual("10");

    expect(list[1].nodeName.toLowerCase()).toEqual("circle");
    expect(list[1].getAttributeNS(null, "cx")).toEqual("10");
    expect(list[1].getAttributeNS(null, "cy")).toEqual("10");
    expect(list[1].getAttributeNS(null, "r")).toEqual("30");
  });
});
