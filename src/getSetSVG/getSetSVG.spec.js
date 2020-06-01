import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { $$getSVG, $$setSVG } from "./getSetSVG.index.js";

describe(`$$setSVG + $$getSVG`, function () {
  it(`$$setSVG will change return value of $$getSVG.`, function () {
    const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    $$setSVG($svg);

    expect($$getSVG()).to.equal($svg);
  });
});

describe(`$$setSVG`, function () {
  it(`The return value is the 1st argument.`, function () {
    const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    expect($$setSVG($svg)).to.equal($svg);
  });
});

describe(`$$getSVG`, function () {
  beforeEach(function () {
    $$setSVG(undefined);
  });

  it(`The return value is a SVGSVGElement.`, function () {
    const $svg = $$getSVG();

    expect($svg.nodeName.toLowerCase()).to.equal("svg");
  });

  it(`The return value will be always same.`, function () {
    const [$svg1, $svg2] = mapL(() => $$getSVG(), rangeL(2));

    expect($svg1).to.equal($svg2);
  });
});
