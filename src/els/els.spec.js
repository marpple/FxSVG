import chai from "chai";
import {
  entriesL,
  equals2,
  flatMapL,
  go,
  join,
  map,
  mapL,
  rangeL,
  zip,
} from "fxjs/es";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$els } from "./els.index.js";

const { expect } = chai;

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const setupMockIntString = (len, min = -100, max = 100) =>
  go(
    rangeL(len),
    mapL(() => makeRandomInt(min, max)),
    mapL((n) => `${n}`)
  );

export default ({ describe, it }) => [
  describe(`$$els`, function () {
    it(`The return value is a list of SVG elements using the input SVG string.`, function () {
      this.slow(1000);

      const list = go(
        rangeL(makeRandomInt(1)),
        mapL(() => makeRandomInt(0, 3)),
        map((flag) => {
          if (equals2(flag, 1)) {
            const [cx, cy] = setupMockIntString(2);
            const r = `${makeRandomInt(1)}`;
            const clazz = "circle dot";
            return {
              name: "circle",
              attrs: { cx, cy, r, class: clazz },
              str: `<circle cx="${cx}" cy="${cy}" r="${r}" class="${clazz}"></circle>`,
            };
          }

          if (equals2(flag, 2)) {
            const [cx, cy] = setupMockIntString(2);
            const [rx, ry] = setupMockIntString(2, 1);
            const style = "stroke: red;";
            return {
              name: "ellipse",
              attrs: { cx, cy, rx, ry, style },
              str: `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="${style}"></ellipse>`,
            };
          }

          const [x, y] = setupMockIntString(2);
          const [width, height] = setupMockIntString(2, 1);
          return {
            name: "rect",
            attrs: { x, y, width, height },
            str: `<rect x="${x}" y="${y}" width="${width}" height="${height}"></rect>`,
          };
        })
      );
      const svg_str = go(
        list,
        mapL(({ str }) => str),
        join("\n")
      );

      for (const $svg of setupSVGList()) {
        const $list_el = $$els(svg_str)($svg);

        expect($list_el.length).equal(list.length);
        for (const [{ name, attrs }, $el] of zip(list, $list_el)) {
          expect($el).instanceof(SVGElement);
          expect($el.nodeName.toLowerCase()).equal(name);
          for (const [key, expect_value] of entriesL(attrs)) {
            const receive_value = $$getAttrNS(key)($el);
            expect(receive_value).equal(expect_value);
          }
        }
      }
    });

    it(`The return value is a empty list
        when the input SVG string is empty string or there is no input SVG string.`, function () {
      const cases = flatMapL(
        ($svg) => mapL((svg_str) => ({ svg_str, $svg }), ["", undefined]),
        setupSVGList()
      );

      for (const { $svg, svg_str } of cases) {
        const $list_el = $$els(svg_str)($svg);

        expect($list_el.length).equal(0);
      }
    });
  }),
];
