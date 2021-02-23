import chai from "chai";
import { html } from "fxjs/es";
import { $$el } from "../el/el.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$convertClientToUserCoords } from "./convertClientToUserCoords.index.js";

const { expect } = chai;

const waitFor = (ms = 0) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

export default ({ describe, it }) => [
  describe(`$$convertClientToUserCoords`, async function () {
    it(`The function returns a SVGPoint instance.`, async function () {
      this.slow(500);

      // given
      const svg_el = $$getSVG();
      const client_x = 100;
      const client_y = 100;
      document.body.appendChild(svg_el);

      await waitFor(100);

      // when
      const user_point = $$convertClientToUserCoords({
        x: client_x,
        y: client_y,
      })(svg_el);

      // then
      expect(user_point).instanceof(SVGPoint);

      document.body.removeChild(svg_el);
    });

    it(`The function converts a point from CSSOM's client coordinate system
        to a point of SVG DOM's user coordinate system.`, async function () {
      this.slow(500);

      // given
      const svg_el = $$el(
        html`<svg
          style="position: absolute; top: 100px; left: 100px; z-index: 99999;"
          width="50"
          height="100"
          viewBox="-500 -80 2000 1000"
          preserveAspectRatio="xMidYMid meet"
        ></svg>`
      )();
      document.body.appendChild(svg_el);
      const client_x = 125;
      const client_y = 150;
      const expect_x = 500;
      const expect_y = 420;

      await waitFor(100);

      // when
      const point = $$convertClientToUserCoords({ x: client_x, y: client_y })(
        svg_el
      );

      // then
      expect(point.x).equal(expect_x);
      expect(point.y).equal(expect_y);

      document.body.removeChild(svg_el);
    });
  }),
];
