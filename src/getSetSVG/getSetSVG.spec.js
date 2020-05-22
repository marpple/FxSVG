import { createSVGWindow } from "svgdom";
import { $$getSVG, $$setSVG } from "./getSetSVG.index.js";

describe(`$$setSVG + $$getSVG`, () => {
  test(`$$setSVG will change return value of $$getSVG`, () => {
    const $svg = createSVGWindow().document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    $$setSVG($svg);

    expect($$getSVG()).toBe($svg);
  });
});

describe(`$$setSVG`, () => {
  test(`return the 1st argument`, () => {
    const $svg = createSVGWindow().document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    expect($$setSVG($svg)).toBe($svg);
  });
});

describe(`$$getSVG`, () => {
  beforeEach(() => {
    $$setSVG(undefined);
  });

  test(`will return SVGSVGElement`, () => {
    const $svg = $$getSVG();

    expect($svg.nodeName.toLowerCase()).toEqual("svg");
  });

  test(`will always return same value`, () => {
    const $svg1 = $$getSVG();
    const $svg2 = $$getSVG();

    expect($svg1).toBe($svg2);
  });
});
