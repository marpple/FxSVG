import { expect } from "chai";
import {
  entriesL,
  equals2,
  flatMapL,
  go,
  go1,
  join,
  map,
  mapL,
  rangeL,
  zip,
} from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { $$els } from "./els.index.js";

export default ({ describe, it }) => [
  describe(`$$els`, function () {
    it(`The return value is a list of SVG elements using the input SVG string.`, function () {
      this.slow(1000);

      const cases = go(
        [
          $$els(),
          $$els(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        ],
        mapL((f) => {
          const list = go(
            makeRandomInt(1),
            rangeL,
            mapL(() => makeRandomInt(0, 3)),
            map((flag) => {
              if (equals2(flag, 1)) {
                const name = "circle";
                const [cx, cy] = go(
                  rangeL(2),
                  mapL(() => makeRandomInt(-100, 100)),
                  mapL((n) => `${n}`)
                );
                const r = `${makeRandomInt(1)}`;
                const clazz = "circle dot";
                return {
                  name,
                  attrs: { cx, cy, r, class: clazz },
                  str: `<${name} cx="${cx}" cy="${cy}" r="${r}" class="${clazz}"></${name}>`,
                };
              }

              if (equals2(flag, 2)) {
                const name = "ellipse";
                const [cx, cy] = go(
                  rangeL(2),
                  mapL(() => makeRandomInt(-100, 100)),
                  mapL((n) => `${n}`)
                );
                const [rx, ry] = go(
                  rangeL(2),
                  mapL(() => makeRandomInt(1)),
                  mapL((n) => `${n}`)
                );
                const style = "stroke: red;";
                return {
                  name,
                  attrs: { cx, cy, rx, ry, style },
                  str: `<${name} cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="${style}"></${name}>`,
                };
              }

              const name = "rect";
              const [x, y] = go(
                rangeL(2),
                mapL(() => makeRandomInt(-100, 100)),
                mapL((n) => `${n}`)
              );
              const [width, height] = go(
                rangeL(2),
                mapL(() => makeRandomInt(1)),
                mapL((n) => `${n}`)
              );
              return {
                name,
                attrs: { x, y, width, height },
                str: `<${name} x="${x}" y="${y}" width="${width}" height="${height}"></${name}>`,
              };
            })
          );
          const $list_el = go(
            list,
            mapL(({ str: s }) => s),
            join("\n"),
            (str) => f(str)
          );
          return { list, $list_el };
        })
      );

      for (const { list, $list_el } of cases) {
        expect($list_el.length).to.equal(list.length);

        for (const [{ name, attrs }, $el] of zip(list, $list_el)) {
          expect($el).to.instanceof(SVGElement);
          expect($el.nodeName.toLowerCase()).to.equal(name);
          for (const [key, expect_value] of entriesL(attrs)) {
            const receive_value = $el.getAttributeNS(null, key);
            expect(receive_value).to.equal(expect_value);
          }
        }
      }
    });

    it(`The return value is a empty list
        when the input SVG string is empty string or there is no input SVG string.`, function () {
      const cases = go1(
        [
          $$els(),
          $$els(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        ],
        flatMapL((f) => mapL((input) => f(input), ["", undefined]))
      );

      for (const $list_el of cases) {
        expect($list_el.length).to.equal(0);
      }
    });
  }),
];
